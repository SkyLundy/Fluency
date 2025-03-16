<?php

// FileCompiler=0

declare(strict_types=1);

namespace ProcessWire;

wire('classLoader')->addNamespace('Fluency', __DIR__ . '/app');

use Fluency\{
    FluencyLocalization as Localization,
    FluencyMarkup as Markup,
    FluencyErrors as Errors,
};
use Fluency\Caching\{TranslationCache, EngineLanguagesCache};
use Fluency\Components\{ApiUsageTableFieldset, StandaloneTranslatorFieldset};
use Fluency\DataTransferObjects\{
    AllConfiguredLanguagesData,
    ConfiguredLanguageData,
    EngineApiUsageData,
    EngineInfoData,
    EngineLanguageData,
    EngineTranslatableLanguagesData,
    EngineTranslationData,
    FluencyConfigData,
    TranslationRequestData,
};
use Fluency\Engines\FluencyEngine;
use Fluency\Services\FluencyProcessWireFileTranslator as ProcessWireFileTranslator;
use InvalidArgumentException;
use ProcessWire\FluencyConfig;
use RuntimeException;
use stdClass;

use function Fluency\Functions\{
    arrayContainsOnlyInstancesOf,
    arrayContainsOnlyType,
    createLanguageConfigName,
};

/**
 * #pw-summary The complete translation suite module for ProcessWire
 *
 * #pw-body =
 *
 * Fluency provides translation service integrations via ProcessWire admin pages and Inputfields for
 * use by users, a module interface for ProcessWire developers anywhere, and a RESTful API that can
 * be used by developers within the admin. Fluency utilizes Data Transfer Objects as the method used
 * to pass data to, and receive data from, methods throughout the Fluency codebase.     jnces are
 * provided for each function in this documentation where they are used and should be expected as
 * return values.
 *
 * Fluency is modular and provides a framework for adding additional translation services as
 * Translation Engines. Each engine is a self-contained set of classes that provides information
 * about the Translation Engine, individual configurations, and the translator implementation itself.
 *
 * For more information regarding Translation Engine development, reference the documentation file
 * at `Fluency/app/Engines/DEVDOC.md`
 *
 * #pw-body
 *
 */

final class Fluency extends Process implements Module, ConfigurableModule
{
    /**
     * The attribute applied to fields at render time where translation is disabled
     */
    private const TRANSLATION_DISABLED_FIELD_ATTR = 'data-ft-disable-translation';

    private ?FluencyEngine $translationEngine = null;

    private ?EngineInfoData $translationEngineInfo = null;

    private ?FluencyConfigData $fluencyConfig = null;

    private ?TranslationCache $translationCache = null;

    private ?EngineLanguagesCache $engineLanguagesCache = null;

    private ?ProcessWireFileTranslator $processWireFileTranslator = null;

    /**
     * Memoizing Fluency::getConfiguredLanguages() output
     */
    private ?AllConfiguredLanguagesData $configuredLanguages = null;


    /**
     * Path to Fluency JS scripts
     */
    private ?string $moduleJsPath = null;

    /**
     * Path to Fluency CSS files
     */
    private ?string $moduleCssPath = null;

    /**
     * Make Fluency available globally via $fluency
     *
     * @return void
     */
    public function init()
    {
        // Create global $fluency variable
        $this->wire->set('fluency', $this);

        $this->fluencyConfig = (new FluencyConfig())->getConfigData();

        if (!$this->translationEngineIsReady()) {
            return;
        }

        $this->moduleJsPath = "{$this->urls->$this}assets/scripts/";
        $this->moduleCssPath = "{$this->urls->$this}assets/styles/";

        $this->initializeCaches();
        $this->initializeTranslationEngine();
        $this->processWireFileTranslator = new ProcessWireFileTranslator($this);
    }

    /**
     * Executes admin UI when PW is ready
     * @return void
     */
    public function ready()
    {
        if (!$this->moduleShouldInitInAdmin()) {
            return false;
        }

        $this->registerFieldConfigurationHooks();
        $this->registerFieldRenderHooks();
        $this->insertAdminAssets();
    }

    /**
     * ProcessWire languages are configured within Fluency and translation is available for admin Inputfields
     *
     * Requires that:
     * - The default ProcessWire language has been configured in Fluency
     * - At least one additional language has been configured in Fluency
     * - The Translation Engine has been configured and is ready to process requests
     *
     * #pw-notes Requires that ProcessWire languages are configured in Fluency
     *
     * #pw-group-Translation-Readiness
     *
     * @return bool
     */
    public function inputfieldTranslationIsReady(): bool
    {
        return $this->translationEngineIsReady() && count($this->getConfiguredLanguages()) >= 2;
    }

    /**
     * Translation Engine has been configured and is ready to process requests
     *
     * This indicates that the Translation Engine authenticates and is able to send and receive data
     * via the corresponding translation service API. This is separate from
     * Fluency::inputfieldTranslationIsReady() in that it does not indicate whether languages have
     * been configured within Fluency.
     *
     * Requires that:
     *
     * - A Translation Engine is selected in Fluency
     * - The Translation Engine is configured in Fluency and ready
     * - The translation service API used by the engine successfuly accepts/returns requests
     *
     * #pw-notes Does not require ProcessWire languages to be configured in Fluency
     *
     * #pw-group-Translation-Readiness
     *
     * @return bool
     */
    public function translationEngineIsReady(): bool
    {
        return $this->fluencyConfig?->translation_api_ready ?? false;
    }

    /**
     * Adds ability to disable translation per-field when configuring multi-language fields
     */
    private function registerFieldConfigurationHooks(): void
    {
        $localization = Localization::getFor('fieldConfiguration');

        // Adds a "Disable Fluency" checkbox for a hooked field configuration
        $addCheckbox = function (HookEvent $e) use ($localization): void {
            $field = $e->arguments(0);

            $checkbox = $this->modules->InputfieldCheckbox;
            $checkbox->icon = 'language';
            $checkbox->attr('name', 'ftDisableTranslation');
            $checkbox->label = $localization->checkboxTitle;
            $checkbox->checkboxLabel = $localization->checkboxLabel;
            $checkbox->checkedValue = 1;
            $checkbox->uncheckedValue = 0;
            $checkbox->checked((bool) $field->get('ftDisableTranslation'));

            $e->return->add($checkbox);
        };

        $this->wire->addHookAfter("FieldtypeTextLanguage::getConfigInputfields", $addCheckbox);
        $this->wire->addHookAfter("FieldtypeTextAreaLanguage::getConfigInputfields", $addCheckbox);
    }

    /**
     * Renders multi-language fields without translation abilities where configured
     */
    private function registerFieldRenderHooks(): void
    {
        $disableTranslation = function (HookEvent $e): void {
            $inputfield = $e->object;

            if (!$inputfield->useLanguages || !$inputfield->hasField?->ftDisableTranslation) {
                return;
            }

            $e->object->setAttribute(self::TRANSLATION_DISABLED_FIELD_ATTR, '');
        };

        $this->wire->addHookBefore("InputfieldTextArea::render", $disableTranslation);
        $this->wire->addHookBefore("InputfieldText::render", $disableTranslation);
    }

    /**
     * Determine if module should initialize
     */
    private function moduleShouldInitInAdmin(): bool
    {
        return $this->page->name !== 'login' && $this->userIsAuthorized() && !!$this->fluencyConfig;
    }

    /**
     * Creates the Translation Engine, engine config, and engine info objects for the module
     */
    private function initializeTranslationEngine(): void
    {
        $selectedEngine = $this->fluencyConfig?->selected_engine;

        if (!$selectedEngine) {
            return;
        }

        $this->translationEngine = new $selectedEngine->engineClass($this->fluencyConfig);
        $this->translationEngineInfo = $selectedEngine->info();
    }

    /**
     * Create instances of cachaes
     */
    private function initializeCaches(): void
    {
        $this->translationCache = new TranslationCache();
        $this->engineLanguagesCache = new EngineLanguagesCache();
    }

    /**
     * User is authorized to use Fluency and translation features
     */
    private function userIsAuthorized(): bool
    {
        return $this->user->isSuperuser() || $this->user->hasPermission('fluency-translate');
    }

    /**
     * Inserts required assets into admin pages on load.
     */
    private function insertAdminAssets(): void
    {
        if ($this->page->rootParent->id !== 2) {
            return;
        }

        $this->config->js('fluency', $this->getClientData());

        match ($this->page->name) {
            'module' => $this->insertFluencyConfigPageAssets(),
            'language-translator' => $this->insertProcessWireLanguageTranslatorAssets(),
            default => $this->insertCoreAssets(),
        };
    }

    /**
     * Insert core styles and scripts for use on pages where Inputfield translation is desired
     */
    private function insertCoreAssets(): void
    {
        $this->config->styles->add("{$this->moduleCssPath}fluency_core.min.css");
        $this->config->scripts->add("{$this->moduleJsPath}fluency.bundle.js");
    }

    /**
     * Insert config page assets, only does if the config page is Fluency
     */
    private function insertFluencyConfigPageAssets(): void
    {
        if ($this->input->get->name === 'Fluency') {
            $this->config->styles->add("{$this->moduleCssPath}fluency_module_config.min.css");
            $this->config->scripts->add("{$this->moduleJsPath}fluency_module_config.bundle.js");
        }
    }

    /**
     * Inserts assets for use on ProcessWire's Language Support translation pages
     */
    private function insertProcessWireLanguageTranslatorAssets(): void
    {
        if ($this->input->urlSegment(1) === 'add') {
            return;
        }

        $this->config->js('fluency', $this->getClientData());
        $this->config->styles->add("{$this->moduleCssPath}fluency_core.min.css");
        $this->config->scripts->add("{$this->moduleJsPath}fluency_language_translator.bundle.js");
    }

    /**
     * Insert styles and scripts for use by the Standalone Translator
     *
     * #pw-internal
     */
    public function insertStandaloneTranslatorAssets(): void
    {
        $this->config->js('fluency', $this->getClientData());
        $this->config->scripts->add("{$this->moduleJsPath}fluency_standalone_translator.bundle.js");
        $this->config->styles->add("{$this->moduleCssPath}fluency_standalone_translator.min.css");
    }

    /**
     * Insert styles and scripts for use by the API Usage Table
     *
     * #pw-internal
     */
    public function insertApiUsageTableFieldsetAssets(): void
    {
        $this->config->js('fluency', $this->getClientData());
        $this->config->scripts->add("{$this->moduleJsPath}fluency_api_usage.bundle.js");
        $this->config->styles->add("{$this->moduleCssPath}fluency_api_usage.min.css");
    }

    /**
     * Module actions and Translation Engine interfaces
     */

    /**
     * Get all ProcessWire languages configured in Fluency
     * Return AllConfiguredLanguagesData object contains methods to access specific configured
     * languages by property/value
     *
     * #pw-group-Fluency-Module-Configuration-Data
     *
     * @see Fluency/DataTransferObjects/AllConfiguredLanguagesData
     * @see Fluency/DataTransferObjects/ConfiguredLanguageData
     *
     * @return AllConfiguredLanguagesData
     */
    public function getConfiguredLanguages(): AllConfiguredLanguagesData
    {
        $engineInfo = $this->translationEngineInfo;

        if (!$engineInfo?->configId) {
            return AllConfiguredLanguagesData::fromArray([
                'languages' => []
            ]);
        }

        if (!is_null($this->configuredLanguages)) {
            return $this->configuredLanguages;
        }

        $createConfiguredLanguage = function ($configured, Language $pwLanguage) {
            $configuredLanguage = $this->getConfiguredLanguageByProcessWireId($pwLanguage->id);

            // If this ProcessWire language is not configured in Fluency, skip.
            if (!$configuredLanguage) {
                return $configured;
            }

            $configured[] = $configuredLanguage;

            return $configured;
        };

        $processWireLanguages = array_values($this->languages->getIterator()->getArray());

        $languages = array_reduce($processWireLanguages, $createConfiguredLanguage, []);

        // Create an array of Fluency configured language object from an  array of ProcessWire languages
        return $this->configuredLanguages = AllConfiguredLanguagesData::fromArray([
            'languages' => $languages,
        ]);
    }

    /**
     * Gets a language configured in Fluency using it's ProcessWire ID. Internal use only.
     *
     * To get a Fluency configured langauge via it's ProcessWire ID, please use:
     * $fluency->getConfiguredLanguages()->getLangaugeByProcessWireId(int $id);
     *
     * @see Fluency/DataTransferObjects/ConfiguredLanguageData
     *
     * @param  int $processWireId ProcessWire language ID
     * @return ConfiguredLanguageData|null  Null if language is not configured within Fluency
     */
    private function getConfiguredLanguageByProcessWireId(
        int $processWireId
    ): ?ConfiguredLanguageData {
        if (!$this->translationEngineInfo) {
            return null;
        }

        $configuredLanguage = $this->{createLanguageConfigName($processWireId, $this->translationEngineInfo)};

        // If this ProcessWire language is not configured in Fluency, skip.
        if (!$configuredLanguage) {
            return null;
        }

        $pwLanguage = $this->languages->get($processWireId);
        $pwTitle = $pwLanguage->title;
        $userLanguage = $this->user->language;

        // ProcessWire\Language::$title may return an object depending on context.
        if (is_object($pwTitle)) {
            $pwTitle = $pwLanguage->title->getLanguageValue($userLanguage);
        }

        return ConfiguredLanguageData::fromArray([
            'id' => $processWireId,
            'title' => $pwTitle,
            'default' => $pwLanguage->name === 'default',
            'engineLanguage' => EngineLanguageData::fromJson($configuredLanguage),
            'isCurrentLanguage' => $pwLanguage === $userLanguage
        ]);
    }

    /**
     * Get an array of ProcessWire language IDs that are not configured in Fluency
     *
     * #pw-group-Fluency-Module-Configuration-Data
     *
     * @return array<int>
     */
    public function getUnconfiguredLanguages(): array
    {
        if ($this->unconfiguredLanguages) {
            return $this->unconfiguredLanguages;
        }

        $languageIds = array_map(
            fn ($language) => $language->id,
            array_values($this->languages->getIterator()->getArray())
        );

        $configuredLanguages = $this->getConfiguredLanguages();

        $unconfiguredLanguages = array_filter(
            $languageIds,
            fn ($languageId) => !$configuredLanguages->getByProcessWireId($languageId)
        );

        return $this->unconfiguredLanguages = array_values($unconfiguredLanguages);
    }

    /**
     * Gets all configuration data in one object. This is passed to the Fluency UI rendering
     * JavaScript
     *
     * Use caution when hooking this method as changing the data structure may likely cause issues
     * when Fluency elements are rendered in the ProcessWire admin
     *
     * #pw-group-Fluency-Module-Configuration-Data
     *
     * @return stdClass All data needed by client UI scripts.
     */
    public function getClientData(): stdClass
    {
        return (object) [
            'apiEndpoints' => $this->getApiEndpoints(),
            'configuredLanguages' => $this->getConfiguredLanguages()->languages,
            'unconfiguredLanguages' => $this->getUnconfiguredLanguages(),
            'localization' => Localization::getAll(),
            'engine' => $this->getTranslationEngineInfo(),
            'interface' => [
                'inputfieldTranslationAction' => $this->fluencyConfig?->inputfield_translation_action,
                'translationDisabledFieldAttr' => self::TRANSLATION_DISABLED_FIELD_ATTR,
            ],
        ];
    }

    /**
     * Developer Tools
     */

    /**
     * Translate files used by ProcessWire to one or more languages
     *
     * Translate any file that ProcessWire uses such as templates, modules, or any where the `__()`
     * translation function is present. These may be located anywhere on the filesystem including in
     * `site/*` and `wire/*`. This will parse the files passed to the method, find all untranslated
     * strings, create default language translation files where they exist, and add strings found to
     * them. Then all values translated to the specified languages.
     *
     * **Note:** This has the potential to be an "expensive" operation with high API usage. It is
     * important to be aware of the amount of translations that will occur and the number of strings
     * in files.
     *
     * **Important:** this relies the internal `translator()` method on the ProcessWire `Language`
     * object. This feature in Fluency is considered stable however is subject to ProcessWire core
     * changes. Please report any problems by filing an issue on the Fluency Github repository.
     *
     * ~~~~~
     * // Files must be the full file name with path from the root directory
     *
     * // A single file to all languages
     * $fluency->translateProcessWireFiles('site/templates/home.php');
     *
     * // Multiple files to all languages
     * $fluency->translateProcessWireFiles([
     *   'site/templates/home.php',
     *   'site/modules/FieldtypeRepeaterMatrix/InputfieldRepeaterMatrix.module',
     *   'wire/modules/Inputfield/InputfieldText/InputfieldText.module',
     * ]);
     *
     * // Using one or more ProcessWire IDs languages
     * $fluency->translateProcessWireFiles([
     *   'site/templates/home.php',
     *   'site/modules/FieldtypeRepeaterMatrix/InputfieldRepeaterMatrix.module',
     * ], [1028, 1032]);
     *
     * // Create the required default language files before translating
     * $fluency->translateProcessWireFiles([
     *   'site/templates/home.php',
     *   'site/modules/FieldtypeRepeaterMatrix/InputfieldRepeaterMatrix.module',
     * ], [1028, 1032], true);
     *
     * // Using one or more ConfiguredLanguageData objects
     * $targetLanguages = $fluency->getConfiguredLanguages()->getByProcessWireTitle(['French', 'German']);
     *
     * $fluency->translateProcessWireFiles('site/templates/home.php', $targetLanguages);
     * ~~~~~
     *
     *
     * #pw-group-Developer-Tools
     *
     * @param string|array<string> $files ProcessWire file(s) to translate, with path from root
     * @param int|ConfiguredLanguageData|null $targetLanguages Languages translated to with a value of
     *                                                         - ProcessWire IDs
     *                                                         - ConfiguredLangaugeData (Fluency language)
     *                                                         - Array of either above two
     *                                                         - Leaving null translates to all languages
     * @param int|ConfiguredLanguageData|null $sourceLanguage Optional source language, default langauge
     *                                                        if not specfied
     * @param bool $createDefaultFiles Create default files required for translating first
     * @return stdClass Object containing the number of files translated and target languages
     * @throws RuntimeException
     * @throws InvalidArgumentException
     */
    public function translateProcessWireFiles(
        string|array $files,
        int|ConfiguredLanguageData|array|null $targetLanguages = null,
        int|ConfiguredLanguageData|null $sourceLanguage = null,
        bool $overwriteExistingTranslations = false
    ): stdClass {
        if (!$this->inputfieldTranslationIsReady()) {
             throw new RuntimeException(
                Errors::getMessage(Errors::FLUENCY_NOT_CONFIGURED)
            );
        }

        // Get all configured languages
        $allConfiguredLanguages = $this->getConfiguredLanguages();
        dd($allConfiguredLanguages);
        // Set source to default language if not passed
        $sourceLanguage ??= $allConfiguredLanguages->getDefault();

        // If the source language was passed as a ProcessWire ID, get the language by ID
        if (is_int($sourceLanguage)) {
            $sourceLanguage = $allConfiguredLanguages->getByProcessWireId($sourceLanguage);
        }

        if (!$sourceLanguage) {
            throw new InvalidArgumentException(
                Errors::getMessage(Errors::PW_FILE_INVALID_TARGET_LANGUAGE)
            );
        }

        // Cast target languages to an array or pull all languages if not provided
        $targetLanguages = $targetLanguages ? (array) $targetLanguages : $allConfiguredLanguages->languages;

        $containsOnlyFluencyLanguageObjects = arrayContainsOnlyInstancesOf(
            $targetLanguages,
            ConfiguredLanguageData::class
        );

        // If targetLanguages is not an array of Fluency Language DTOs, convert any ProcessWire IDs to
        // Fluency configured language objects
        if (!$containsOnlyFluencyLanguageObjects) {
            $targetLanguages = array_map(function ($targetLanguage) use ($allConfiguredLanguages) {
                // If already a configured language object, continue
                if (is_a($targetLanguage, ConfiguredLanguageData::class, true)) {
                    return $targetLanguage;
                }

                if (!is_int($targetLanguage)) {
                    throw new InvalidArgumentException(
                        Errors::getMessage(Errors::PW_FILE_INVALID_TARGET_LANGUAGE)
                    );
                }

                return $allConfiguredLanguages->getByProcessWireId($targetLanguage);
            }, $targetLanguages);
        }

        // Remove source language from target languages
        $targetLanguages = array_filter(
            $targetLanguages,
            fn ($language) => $language->id !== $sourceLanguage->id
        );

        if (!$targetLanguages) {
            throw new InvalidArgumentException(
                Errors::getMessage(Errors::PW_FILE_SOURCE_TARGET_MATCH)
            );
        }

        $files = (array) $files;

        // Check for all files as strings, throw an exception if not
        arrayContainsOnlyType($files, 'string', 'Files must only be strings');

        return $this->processWireFileTranslator->translateForProcessWire(
            $files,
            $sourceLanguage,
            $targetLanguages,
            $overwriteExistingTranslations
        );
    }

    /**
     * Get a language code by ProcessWire language ID, falls back to current language without ID
     *
     * The language code returned is defined by the translation service. The format and style may
     * differ depending on the Translation Engine currently in use
     *
     * #pw-group-Developer-Tools
     *
     * @param int|null $processWireId ProcessWire language ID
     * @param string   $languageSource 'fluency' to render using Fluency configured languages or
     *                               'processwire' to render using all languages in processwire
     *                                Default: 'fluency'
     * @return string|null
     * @throws InvalidArgumentException
     */
    public function getLanguageCode(
        ?int $processWireId = null,
        string $languageSource = 'fluency'
    ): ?string {
        $pwId = $processWireId ?? $this->user->language->id;

        return array_reduce(
            $this->getLanguagesForMarkup($languageSource),
            fn ($code, $language) => $code = $language->id === $pwId ? strtolower($language->code) : $code
        );
    }

    /**
     * Render alt language meta tags for use in the document <head> element
     *
     * Increases page SEO quality and adherance to HTML standards
     *
     * By default this outputs HTML tags only for languages configured within Fluency as the language
     * codes needed are acquired through the
     *
     * To use ProcessWire languages it is necessary to add an additional text field called`code` to the `language` system template and provide values for each language.
     * Languages without a value will not be rendered in the markup.
     *
     * ~~~~~
     * <link rel="alternate" hreflang="https://awesomewebsite.com/" href="x-default" />
     * <link rel="alternate" hreflang="https://awesomewebsite.com/" href="en-us" />
     * <link rel="alternate" hreflang="https://awesomewebsite.com/fr/" href="fr" />
     * <link rel="alternate" hreflang="https://awesomewebsite.com/de/" href="de" />
     * <link rel="alternate" hreflang="https://awesomewebsite.com/it/" href="it" />
     * <link rel="alternate" hreflang="https://awesomewebsite.com/es/" href="es" />
     * ~~~~~
     *
     * #pw-group-Developer-Tools
     *
     * @param  string $languageSource 'fluency' to render using Fluency configured languages or
     *                                'processwire' to render using all languages in processwire
     *                                 Default: 'fluency'
     * @return string
     */
    public function renderAltLanguageMetaLinkTags(string $languageSource = 'fluency'): string
    {
        $languages = $this->getLanguagesForMarkup($languageSource);

        $allTags = array_map(
            fn ($language) => Markup::altLanguageLink(
                href: $this->page->localHttpUrl($this->languages->get($language->id)),
                hrefLang: strtolower($language->code)
            ),
            $languages
        );

        $defaultTag = Markup::altLanguageLink(
            hrefLang: $this->page->localHttpUrl($this->languages->get('name=default')),
            href: 'x-default'
        );

        array_unshift($allTags, $defaultTag);

        return implode("\n", $allTags);
    }

    /**
     * Render an accessible language select element with options for each language. Options array
     * allows additional configuration. Optional inline JS that navigates to page in language on
     * select can be added.
     *
     * By default, select options are created only for languages configured within Fluency as the
     * language codes needed are acquired through the Translation Engine
     *
     * To use ProcessWire languages as the `$languageSource` it is necessary to add an additional text
     * field called `language_code` to the `language` system template and provide values for each.
     * Languages without a value will not be rendered in the markup.
     *
     * #pw-group-Developer-Tools
     *
     * @param  bool $addInline Include inline JS that navigates on select
     * @param  string $id Optional value for `<select>` id attribute
     * @param  string|array $classes Optional value for `<select>` id attribute
     * @param  string $languageSource Pass 'fluency' to render using Fluency configured languages or
     *                                'processwire' to render using all languages in processwire
     *                                Default: 'fluency'
     * @return string
     * @throws InvalidArgumentException
     */
    public function renderLanguageSelect(
        bool $addInlineJs = true,
        string $id = '',
        string|array $classes = [],
        string $languageSource = 'fluency'
    ): string {
        // Create option elements from language IDs
        $options = array_reduce(
            $this->getLanguagesForMarkup($languageSource),
            fn ($tags, $language) => $tags .= Markup::selectOption(
                value: $this->page->localUrl($language->id),
                selected: $language->isCurrentLanguage,
                label: $language->title
            ),
            ''
        );

        return Markup::languageSelect(
            classes: $classes,
            addInlineJs: $addInlineJs,
            options: $options,
            id: $id
        );
    }

    /**
     * Render an unordered list of links that change the language shown on the current page
     *
     * By default, select options are created only for languages configured within Fluency as the
     * language codes needed are acquired through the Translation Engine
     *
     * To use ProcessWire languages it is necessary to add an additional text field called
     * `language_code` to the `language` system template and provide values for each language.
     * Languages without a value will not be rendered in the markup.
     *
     * #pw-group-Developer-Tools
     *
     * @param string|array|null $classes Classes to add to <ul> element
     * @param string $id                 ID to add to <ul> element
     * @param string $activeClass        Class added to the <li> element containing the link for the
     *                                   current page.
     * @param string $divider            String wrapped in <li> added between link <li> elements
     * @param string $languageSource     'fluency' to render using Fluency configured languages or
     *                                   'processwire' to render using all languages in processwire
     *                                    Default: 'fluency'
     * @return string
     */
    public function renderLanguageLinks(
        string|array|null $classes = null,
        string $id = '',
        string $divider = null,
        ?string $activeClass = 'active',
        string $languageSource = 'fluency',
    ): string {
        $languages = $this->getLanguagesForMarkup($languageSource);

        if (!!$divider) {
            $divider = Markup::li(content: $divider, classes: 'divider');
        }

        $items = array_reduce($languages, function ($tags, $language) use ($activeClass, $divider) {
            $tags[] = Markup::li(
                classes: $language->isCurrentLanguage ? $activeClass : null,
                content: Markup::a(
                    href: $this->page->localUrl($language->id),
                    content: $language->title,
                )
            );

            if (!!$divider) {
                $tags[] = $divider;
            }

            return $tags;
        }, []);

        if (end($items) === $divider) {
            array_pop($items);
        }

        return Markup::ul(items: $items, classes: $classes ?? '', id: $id);
    }

    /**
     * Gets languages for markup
     *
     * NOTE: If 'processwire' is passed, a field with the name 'code' must be added to the language
     * system template. Passing 'fluency' will automatically use the language codes provided by the
     * translation service.
     *
     * @param  string $source Either 'fluency' or 'processwire'
     * @throws InvalidArgumentException
     */
    private function getLanguagesForMarkup(string $source = 'fluency'): array
    {
        return match ($source) {
            'fluency' => $this->getFluencyLanguagesForMarkup(),
            'processwire' => $this->getProcessWireLanguagesForMarkup(),
            default => throw new InvalidArgumentException(
                "Argument passed must be either 'fluency' or 'processwire', '{$source}' given"
            ),
        };
    }

    /**
     * Creates an array of data used by getLanguagesForMarkup
     */
    private function getProcessWireLanguagesForMarkup(): array
    {
        $this->fields->get('language_code');
        $languageFields = $this->templates->get('name=language')->fields;
        $fieldNames = array_values($this->fieldgroups->getFieldNames($languageFields));

        if (!in_array('code', $fieldNames)) {
            throw new InvalidArgumentException(
                "Failed to render alt language link tags for ProcessWire languages. A text field with " .
                    "the name 'code' must be added to the ProcessWire 'language' system template"
            );
        }

        $languages = array_map(
            fn ($language) => !$language->code ? null : (object) [
                'id' => $language->id,
                'code' => $language->code,
                'title' => $language->title,
                'isCurrentLanguage' => $language->id === $this->user->language->id
            ],
            $this->languages->getIterator()->getArray()
        );

        return array_filter($languages);
    }


    /**
     * Creates an array of data used by getLanguagesForMarkup
     */
    private function getFluencyLanguagesForMarkup(): array
    {
        return array_map(
            fn ($language) => (object) [
                'id' => $language->id,
                'code' => $language->engineLanguage->targetCode,
                'title' => $language->title,
                'isCurrentLanguage' => $language->id === $this->user->language->id
            ],
            $this->getConfiguredLanguages()->languages
        );
    }

    /**
     * Fluency Caching
     */

    /**
     * Get the number of translations in cache for currently selected Translation Engine
     *
     * #pw-group-Caching
     *
     * @return int
     */
    public function getCachedTranslationsCount(): int
    {
        return $this->translationCache->count();
    }

    /**
     * Clear all cached translations for the currently selected Translation Engine
     *
     * #pw-group-Caching
     *
     * @return int The number of cached translations, zero indicates success
     */
    public function clearTranslationCache(): int
    {
        return $this->translationCache->clear();
    }

    /**
     * Clear cached translatable languages list for the currently selected Translation Engine
     *
     * Cached language lists are never automatically cleared. If a translation service has
     * released new languages but are not appearing within Fluency as avalable, clear this cache.
     *
     * #pw-group-Caching
     *
     * @return int Number of cached translatable languages, zero indicates success
     */
    public function clearTranslatableLanguagesCache(): int
    {
        return $this->engineLanguagesCache->clear();
    }

    /**
     * Determine if translatable languages are currently cached
     *
     * #pw-group-Caching
     *
     * @return bool
     */
    public function translatableLanguagesAreCached(): bool
    {
        return (bool) $this->engineLanguagesCache->count();
    }

    /**
     * Deletes all caches used by Fluency
     *
     * #pw-group-Caching
     *
     * @return int Number of items remaining in cache, zero indicates success
     */
    public function clearAllCaches(): int
    {
        $translatableLanguages = $this->clearTranslatableLanguagesCache();
        $translations = $this->clearTranslationCache();

        return $translatableLanguages + $translations;
    }

    /**
     * Translation Engine Interfaces
     */

    /**
     * Translate content from one language to another
     *
     * ~~~~~
     * $result = $fluency->translate('EN', 'DE', 'How do you do, fellow developers?');
     *
     * // Access data using their properties
     * $result->translations;              // => ['Wie geht es Ihnen, liebe Entwicklerfreunde?']
     * $result->content;                   // => ['How do you do, fellow developers?']
     * $result->error;                     // => null or FluencyErrors constant value
     * $result->fromCache;                 // => false
     * $result->retrievedAt;               // => '2023-08-25T23:35:09+00:00'
     *
     * // This also contains an EngineLanguageData object for both source and target languages
     * $result->sourceLanguage->sourceCode; // => DE
     * $result->sourceLanguage->sourceName; // => German
     * $result->sourceLanguage->targetCode; // => DE
     * $result->sourceLanguage->targetName; // => German
     * $result->sourceLanguage->meta;       // => [] (Usage varies by Translation Engine)
     *
     * // Return object can be converted to an array
     * $result->toArray();
     *
     * // Return object can be directly converted to json
     * $json = json_encode($result);
     *
     * // The number of translations can be found using count
     * $translationCount = count($result)
     * ~~~~~
     *
     * #pw-group-Translation-Engine-Interface
     *
     * @see Fluency/DataTransferObjects/EngineTranslationData
     * @see Fluency/DataTransferObjects/EngineLanguageData
     * @see Fluency/Errors
     *
     * @param  string $sourceLanguage  Translation language code
     * @param  string $targetLanguage  Translation language code
     * @param  string|array $content   Multiple translations in an array are per-Engine based on translation service
     * @param  array $options          Additional options defined and used by the Translation Engine
     * @param  bool $caching           Can override module config per-request
     * @return EngineTranslationData
     */
    public function translate(
        string $sourceLanguage = '',
        string $targetLanguage = '',
        array|string $content = [],
        ?array $options = [],
        ?bool $caching = null
    ): EngineTranslationData {
        $source = $this->getTranslatableLanguages()->bySourceCode($sourceLanguage);
        $target = $this->getTranslatableLanguages()->byTargetCode($targetLanguage);

        $requestData = [
            'sourceLanguage' => $source?->sourceCode ?? $sourceLanguage,
            'targetLanguage' => $target?->targetCode ?? $targetLanguage,
            'content' => (array) $content,
            'options' => $options ?? []
        ];

        $request = TranslationRequestData::fromArray($requestData);

        if (!$source || !$target) {
            $error = match (true) {
                !$source => Errors::FLUENCY_UNKNOWN_SOURCE,
                !$target => Errors::FLUENCY_UNKNOWN_SOURCE,
            };

            return EngineTranslationData::fromArray(['request' => $request, 'error' => $error]);
        }

        // If caching is overridden in this method call, if null fall back to module config setting
        if ($caching ?? $this->fluencyConfig->translation_cache_enabled) {
            return $this->translationCache->getOrStoreNew(
                $request,
                fn () => $this->translationEngine->translate($request)
            );
        }

        return $this->translationEngine->translate($request);
    }

    /**
     * Gets the current translation API usage
     *
     * If this feature is not available via the translation service API, the return object will
     * contain FluencyError::FLUENCY_NOT_IMPLEMENTED for the error property
     *
     * // Return object can be converted to an array
     * $result->toArray();
     *
     * // Return object can be directly converted to json
     * $json = json_encode($result);
     *
     * @see Fluency/DataTransferObjects/EngineApiUsageData
     * @see Fluency/Errors
     *
     * #pw-group-Translation-Engine-Interface
     *
     * @return EngineApiUsageData
     */
    public function getTranslationApiUsage(): EngineApiUsageData
    {
        return $this->translationEngine->getApiUsage();
    }

    /**
     * Get an arrays of languages the translation API accepts
     *
     * Results are cached forever speed up subsequent requests. If new languages are released
     * by the translation service, they will not automatically be available in Fluency. This cache can
     * be manually cleared on the Fluency module config page, or $fluency->clearTranslatableLanguagesCache();
     *
     *
     * // Return object can be converted to an array
     * $result->toArray();
     *
     * // Return object can be directly converted to json
     * $json = json_encode($result);
     *
     * @see Fluency/DataTransferObjects/EngineTranslatableLanguagesData
     *
     * #pw-group-Translation-Engine-Interface
     *
     * @param  bool $refresh Forces data retrieval from the translation API and re-caches if no
     *                       errors occur
     * @return EngineTranslatableLanguagesData
     */
    public function ___getTranslatableLanguages(
        bool $refresh = false
    ): EngineTranslatableLanguagesData {
        if ($refresh) {
            $languages = $this->translationEngine->getLanguages();

            $this->engineLanguagesCache->store($languages, $this->translationEngineInfo->configId);

            return $languages;
        }

        return $this->engineLanguagesCache->getOrStoreNew(
            $this->translationEngineInfo->configId,
            fn () => $this->translationEngine->getLanguages()
        );
    }

    /**
     *
     * Returns the current Translation Engine information, if one is selected in Fluency
     *
     * // Return object can be converted to an array
     * $result->toArray();
     *
     * // Return object can be directly converted to json
     * $json = json_encode($result);
     *
     * #pw-group-Translation-Engine-Interface
     *
     * @see Fluency/DataTransferObjects/EngineInfoData
     *
     * @return EngineInfoData|null
     */
    public function getTranslationEngineInfo(): ?EngineInfoData
    {
        return $this->translationEngineInfo;
    }

    /**
     * REST API
     */

    /**
     * Get all available Fluency REST API endpoints
     *
     * Endpoints can be called via AJAX from anywhere within the ProcessWire admin, permissions config
     * applies to Fluency API requests.
     *
     * All endpoints expect/return JSON. HTTP status codes for Fluency API requests reflect the
     * request made to the endpoint itself and not any calls made by Fluency or Translation Engines
     * to external services
     *
     * ```
     * {admin_slug}/fluency/api/                   // GET    (200) - Returns all endpoints available via REST API
     * {admin_slug}/fluency/api/usage/             // GET    (200) - Returns the translation service API usage
     * {admin_slug}/fluency/api/translation/       // POST   (200) - Executes a translation via Fluency/ProcessWire
     * {admin_slug}/fluency/api/languages/         // GET    (200) - Returns all languages configured in Fluency
     * {admin_slug}/fluency/api/cache/languages    // DELETE (204) - Deletes all cached translatable languages for current engine
     * {admin_slug}/fluency/api/cache/translations // GET    (200) - Gets the number of translations cached
     *                                             // DELETE (204) - Deletes all cached translations
     * ```
     * Invalid request methods return HTTP 405 Method Not Allowed
     *
     * Requests made to nonexistent endpoints return HTTP 404 Not Found
     *
     * #pw-group-Fluency-REST-API
     *
     * @return object
     */
    public function getApiEndpoints(): stdClass
    {
        return (object) [
            'endpoints' => "{$this->urls->admin}fluency/api/",
            'usage' => "{$this->urls->admin}fluency/api/usage/",
            'translation' => "{$this->urls->admin}fluency/api/translation/",
            'languages' => "{$this->urls->admin}fluency/api/languages/",
            'cache' => "{$this->urls->admin}fluency/api/cache/",
            'translationCache' => "{$this->urls->admin}fluency/api/cache/translations",
            'translatableLanguagesCache' => "{$this->urls->admin}fluency/api/cache/languages",
        ];
    }

    /**
     * Renders the global translator page
     *
     * The global translator can be used as long as the Translation Engine can process requests and
     * return data. It does not require that ProcessWire languages are configured within Fluency
     *
     * #pw-group-Fluency-Standalone-Translator
     *
     * @param  bool $rendered Pre-render the InputfieldWrapper and return as a string
     * @return InputfieldWrapper|string
     */
    public function execute(bool $renderToString = true): InputfieldWrapper|string
    {
        $wrapper = $this->modules->InputfieldWrapper;
        $wrapper->addClass('fluency-admin-view');

        $this->initializeTranslationEngine();

        $wrapper->import(StandaloneTranslatorFieldset::render());

        if (
            $this->translationEngineIsReady() &&
            $this->translationEngineInfo->providesUsageData
        ) {
            $wrapper->import(ApiUsageTableFieldset::render(true));
        }

        return $renderToString ? $wrapper->render() : $wrapper;
    }

    /**
     * REST API
     */

    /**
     * Responds to requests made to the /fluency/api endpoint
     *
     * Invalid request methods return HTTP 405 Method Not Allowed.
     *
     * #pw-internal
     *
     * @return void
     */
    public function executeApi(): void
    {
        match ($this->input->urlSegment2) {
            'translation' => $this->apiTranslateEndpoint(),
            'usage' => $this->apiTranslationServiceUsageEndpoint(),
            'languages' => $this->apiLanguagesEndpoint(),
            'cache' => $this->apiCacheEndpoint(),
            default => $this->apiRootEndpoint()
        };
    }

    private function apiRootEndpoint(): void
    {
        $this->validateRequestedEndpoint('GET', 1);

        $this->emitApiResponse(200, $this->getApiEndpoints());
    }

    /**
     * Endpoint: /{admin-slug}/fluency/api/translate
     *
     * @param  string $method HTTP request method
     */
    private function apiTranslateEndpoint(): void
    {
        $this->validateRequestedEndpoint('POST', 2);

        $request = wireDecodeJSON(file_get_contents('php://input'));

        $this->emitApiResponse(200, $this->translate(
            sourceLanguage: $request['sourceLanguage'],
            targetLanguage: $request['targetLanguage'],
            content: $request['content'],
            options: $request['options'] ?? [],
            caching: $request['caching'] ?? null
        ));
    }

    /**
     * Endpoint: /{admin-slug}/fluency/api/usage
     *
     * @param  string $method HTTP request method
     */
    private function apiTranslationServiceUsageEndpoint(): void
    {
        $this->validateRequestedEndpoint('GET', 2);

        $data = $this->getTranslationApiUsage();
        $error = $this->getTranslationApiUsage()->error;

        if ($error === Errors::FLUENCY_NOT_IMPLEMENTED) {
            $this->emitApiError(501, $error);
        }

        $this->emitApiResponse(200, $data);
    }

    /**
     * Endpoint: /{admin-slug}/fluency/api/languages
     *
     * @param  string $method HTTP request method
     */
    private function apiLanguagesEndpoint(): void
    {
        $this->validateRequestedEndpoint('GET', 2);
        $this->emitApiResponse(200, $this->getTranslatableLanguages());
    }

    /**
     * Endpoint: /{admin-slug}/fluency/api/cache/
     * Endpoint: /{admin-slug}/fluency/api/cache/translations
     * Endpoint: /{admin-slug}/fluency/api/cache/languages
     *
     * @param  string $method HTTP request method
     */
    private function apiCacheEndpoint(): void
    {
        $this->validateRequestedEndpoint(maxEndpointDepth: 3);

        switch ($this->input->urlSegment3) {
            case 'translations':
                $this->validateRequestedEndpoint(allowedMethods: ['GET', 'DELETE']);

                match ($this->input->requestMethod()) {
                    'GET' => $this->emitApiResponse(200, $this->getCachedTranslationsCount()),
                    'DELETE' => $this->emitApiResponse(204, $this->clearTranslationCache())
                };

                break;
            case 'languages':
                $this->validateRequestedEndpoint(allowedMethods: 'DELETE');

                if (!$this->clearTranslatableLanguagesCache()) {
                    $this->emitApiResponse(204);
                }

                $this->emitApiError(500, Errors::FLUENCY_MODULE_ERROR);

                break;
            default:
                $this->validateRequestedEndpoint(allowedMethods: 'DELETE');

                if (!$this->clearAllCaches()) {
                    $this->emitApiResponse(204);
                }

                $this->emitApiError(500, Errors::FLUENCY_MODULE_ERROR);

                break;
        }
    }

    /**
     * Outputs a Fluency API error with associated message.
     * Only used for Fluency API errors, not engine response related errors
     *
     * @param  string $fluencyError  A FluencyError constant value
     * @param  int    $status        HTTP Status
     * @return void
     */
    private function emitApiError(int $status, string $fluencyError): void
    {
        $this->emitApiResponse($status, [
            'error' => $fluencyError,
            'message' => Errors::getMessage($fluencyError)
        ]);
    }

    /**
     * Creates a response and outputs JSON payload
     *
     * @param  int    $status HTTP status code, i.e. 200
     * @param  mixed  $data   Data to return
     */
    private function emitApiResponse(int $status, mixed $returnData = null): void
    {
        header('Content-Type: application/json');
        http_response_code($status);

        $status === 204 || is_null($returnData) ? die() : die(json_encode($returnData));
    }

    /**
     * Analyzes an API call and emits an error if invalid or unexpected for an endpoint
     *
     * @param  array|string $allowedMethods   Array of methods accepted at an endpoint
     * @param  int|null     $maxEndpointDepth The number of segments accepted starting at the base endpoint
     *                                        NOTE: Include the root /api segment in the total count
     * @return void
     */
    private function validateRequestedEndpoint(
        array|string|null $allowedMethods = null,
        ?int $maxEndpointDepth = null
    ): void {
        if (
            !is_null($allowedMethods) &&
            !in_array($this->input->requestMethod(), (array) $allowedMethods)
        ) {
            $this->emitApiError(405, Errors::FLUENCY_METHOD_NOT_ALLOWED);
        }

        if (
            !is_null($maxEndpointDepth) &&
            count($this->input->urlSegments) > $maxEndpointDepth
        ) {
            $this->emitApiError(404, Errors::FLUENCY_NOT_FOUND);
        }
    }

    /**
     * Upgrade housekeeping
     *
     * #pw-internal
     *
     * {@inheritdoc}
     */
    public function upgrade($fromVersion, $toVersion)
    {
        $this->initializeCaches();
        $upgradeMessages = [];

        if (
            version_compare($fromVersion, '106', '<=') &&
            !!$this->getCachedTranslationsCount()
        ) {
            $upgradeMessages[] = "If you have experienced issues with encoded HTML characters in translations and translation cache is enabled, please clear Fluency's translation cache";
            $upgradeMessages[] = "Translation engine must be reconfigured after upgrading to Fluency 1.0.6";
        }

        if (version_compare($fromVersion, '108', '<=')) {
            // Necessary since changing how Fluency stores data
            (new FluencyConfig())->resetEngineData();

            $upgradeMessages[] = "Translation engine must be reconfigured after upgrading to Fluency 1.0.8";
        }

        foreach ($upgradeMessages as $message) {
            $this->wire->warning("Fluency: {$message}", 'noGroup');
        }
    }

    /**
     * Uninstall housekeeping
     *
     * @return void
     */
    public function uninstall()
    {
        $this->initializeCaches();
        $this->clearAllCaches();
        $this->uninstallPage();
    }
}
