<?php

// FileCompiler=0

declare(strict_types=1);

namespace ProcessWire;

wire('classLoader')->addNamespace('Fluency\App', __DIR__ . '/app');
wire('classLoader')->addNamespace('Fluency\Assets', __DIR__ . '/assets');
wire('classLoader')->addNamespace('Fluency\Components', __DIR__ . '/app/Components');
wire('classLoader')->addNamespace('Fluency\Caching', __DIR__ . '/app/Caching');
wire('classLoader')->addNamespace('Fluency\Engines', __DIR__ . '/app/Engines');
wire('classLoader')->addNamespace('Fluency\DataTransferObjects', __DIR__ . '/app/DataTransferObjects');
wire('classLoader')->addNamespace('Fluency\Functions', __DIR__ . '/app/Functions');

require_once __DIR__ . '/app/Functions/fluencyEngineConfigNames.php';

use ProcessWire\FluencyConfig;
use Fluency\App\{
  FluencyLocalization as Localization,
  FluencyMarkup as Markup
};
use Fluency\App\FluencyErrors;
use Fluency\Caching\{ TranslationCache, EngineLanguagesCache };
use Fluency\Components\{
  FluencyApiUsageTableFieldset as ApiUsageTableFieldset,
  FluencyStandaloneTranslatorFieldset as StandaloneTranslatorFieldset
};
use Fluency\Engines\FluencyEngine;
use Fluency\DataTransferObjects\{
    AllConfiguredLanguagesData,
    ConfiguredLanguageData,
  EngineApiUsageData,
  EngineInfoData,
  EngineTranslatableLanguagesData,
  EngineTranslationData,
  FluencyConfigData,
  TranslationRequestData
};
use InvalidArgumentException;
use stdClass;

use function Fluency\Functions\createLanguageConfigName;

/**
 * #pw-summary The complete translation suite module for ProcessWire
 *
 * #pw-body =
 *
 * Fluency provides translation service integrations via ProcessWire admin pages and Inputfields for
 * use by users, a module interface for ProcessWire developers anywhere, and a RESTful API that can
 * be used by developers within the admin. Fluency utilizes Data Transfer Objects as the method used
 * to pass data to, and receive data from, methods throughout the Fluency codebase. References are
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
 * Note: Methods that act as interfaces for Translation Engines, in that they relay execution to
 * Translation Engine methods where all translation functionality is defined.
 *
 * #pw-body
 *
 */

final class Fluency extends Process implements Module, ConfigurableModule {

  private ?FluencyEngine $translationEngine = null;

  private ?EngineInfoData $translationEngineInfo = null;

  private ?FluencyConfigData $fluencyConfig = null;

  private ?TranslationCache $translationCache = null;

  private ?EngineLanguagesCache $engineLanguagesCache = null;

  /**
   * Memoizing Fluency::getConfiguredLanguages() output
   * @var AllConfiguredLanguagesData|null
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
  public function init() {
    // Create global $fluency variable
    $this->wire->set('fluency', $this);

    $this->moduleJsPath = "{$this->urls->$this}assets/scripts/";
    $this->moduleCssPath = "{$this->urls->$this}assets/styles/";

    $this->fluencyConfig = (new FluencyConfig())->getConfigData();
    $this->translationCache = new TranslationCache();
    $this->engineLanguagesCache = new EngineLanguagesCache();
    $this->initializeTranslationEngine();
  }

  /**
   * Executes admin UI when PW is ready
   * @return void
   */
  public function ready() {
    if (!$this->moduleShouldInitInAdmin()) {
      return false;
    }

    $this->insertAdminAssets();
  }

  /**
   * Determine if module should initialize
   */
  private function moduleShouldInitInAdmin(): bool {
    return $this->page->name !== 'login' && $this->userIsAuthorized();
  }

  /**
   * Creates the Translation Engine, engine config, and engine info objects for the module
   */
  private function initializeTranslationEngine(): void {
    $selectedEngine = $this->fluencyConfig?->selected_engine;

    if (!$selectedEngine) {
      return;
    }

    $this->translationEngine = new $selectedEngine->engineClass($this->fluencyConfig);
    $this->translationEngineInfo = $selectedEngine->info();
  }

  /**
   * User is authorized to use Fluency and translation features
   */
  private function userIsAuthorized(): bool {
    return $this->user->isSuperuser() || $this->user->hasPermission('fluency-translate');
  }

  /**
   * Inserts required assets into admin pages on load.
   */
  private function insertAdminAssets(): void {
    if ($this->page->rootParent->id !== 2 ) {
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
  private function insertCoreAssets(): void {
    $this->config->styles->add("{$this->moduleCssPath}fluency_core.min.css");
    $this->config->scripts->add("{$this->moduleJsPath}fluency.bundle.js");
  }

  /**
   * Insert config page assets, only does if the config page is Fluency
   */
  private function insertFluencyConfigPageAssets(): void {
    if ($this->input->get->name === 'Fluency') {
      $this->config->styles->add("{$this->moduleCssPath}fluency_module_config.min.css");
      $this->config->scripts->add("{$this->moduleJsPath}fluency_module_config.bundle.js");
    }
  }

  /**
   * Inserts assets for use on ProcessWire's Language Support translation pages
   */
  private function insertProcessWireLanguageTranslatorAssets(): void {
    $this->config->js('fluency', $this->getClientData());
    $this->config->styles->add("{$this->moduleCssPath}fluency_core.min.css");
    $this->config->scripts->add("{$this->moduleJsPath}fluency_language_translator.bundle.js");
  }

  /**
   * Insert styles and scripts for use by the Standalone Translator
   *
   * #pw-internal
   */
  public function insertStandaloneTranslatorAssets(): void {
    $this->config->js('fluency', $this->getClientData());
    $this->config->scripts->add("{$this->moduleJsPath}fluency_standalone_translator.bundle.js");
    $this->config->styles->add("{$this->moduleCssPath}fluency_standalone_translator.min.css");
  }

  /**
   * Insert styles and scripts for use by the API Usage Table
   *
   * #pw-internal
   */
  public function insertApiUsageTableFieldsetAssets(): void {
    $this->config->js('fluency', $this->getClientData());
    $this->config->scripts->add("{$this->moduleJsPath}fluency_api_usage.bundle.js");
    $this->config->styles->add("{$this->moduleCssPath}fluency_api_usage.min.css");
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
  public function inputfieldTranslationIsReady(): bool {
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
  public function translationEngineIsReady(): bool {
    return $this->fluencyConfig->translation_api_ready ?? false;
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
   * @return AllConfiguredLanguagesData
   *
   * Reference `Fluency/app/DataTransferObjects/AllConfiguredLanguagesData.php`
   * and `Fluency/app/DataTransferObjects/ConfiguredLanguageData.php`
   */
  public function getConfiguredLanguages(): AllConfiguredLanguagesData {
    $engineInfo = $this->translationEngineInfo;

    if (!$engineInfo?->configId) {
      return AllConfiguredLanguagesData::fromArray([
        'languages' => []
      ]);
    }

    if (!is_null($this->configuredLanguages)) {
      return $this->configuredLanguages;
    }

    $createConfiguredLanguage = function($configured, Language $pwLanguage) {
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
   * #pw-internal
   *
   * @param  int $processWireId ProcessWire language ID
   * @return ConfiguredLanguageData|null  Null if language is not configured within Fluency
   *
   * Reference `Fluency/app/DataTransferObjects/ConfiguredLanguageData.php`
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
    is_object($pwTitle) && $pwTitle = $pwLanguage->title->getLanguageValue($userLanguage);

    return ConfiguredLanguageData::fromArray([
      'id' => $processWireId,
      'title' => $pwTitle,
      'default' => $pwLanguage->name === 'default',
      'engineLanguage' => unserialize($configuredLanguage),
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
  public function getUnconfiguredLanguages(): array {
    if ($this->unconfiguredLanguages) {
      return $this->unconfiguredLanguages;
    }

    $languageIds = array_map(
      fn($language) => $language->id,
      array_values($this->languages->getIterator()->getArray())
    );

    $configuredLanguages = $this->getConfiguredLanguages();

    $unconfiguredLanguages = array_filter(
      $languageIds,
      fn($languageId) => !$configuredLanguages->getByProcessWireId($languageId)
    );

    return $this->unconfiguredLanguages = array_values($unconfiguredLanguages);
  }

  /**
   * Gets all configuration data in one object. Can be passed into the ProcessWire JavaScript
   * config object
   *
   * #pw-group-Fluency-Module-Configuration-Data
   *
   * @return stdClass All data needed by client UI scripts.
   */
  public function getClientData(): stdClass {
    return (object) [
      'apiEndpoints' => $this->getApiEndpoints(),
      'configuredLanguages' => $this->getConfiguredLanguages()->languages,
      'unconfiguredLanguages' => $this->getUnconfiguredLanguages(),
      'localization' => Localization::getAll(),
      'engine' => $this->getTranslationEngineInfo(),
      'interface' => [
        'inputfieldTranslationAction' => $this->fluencyConfig->inputfield_translation_action,
      ],
    ];
  }

  /**
   * Front End Utilities & Markup Rendering
   */

  /**
   * Get a language code by ProcessWire language ID, falls back to current language without ID
   *
   * The language code returned is defined by the translation service. The format and style may
   * differ depending on the Translation Engine currently in use
   *
   * #pw-group-Page-And-Markup-Utilities
   *
   * @param int $processWireId ProcessWire language ID
   * @param string $languageSource 'fluency' to render using Fluency configured languages or
   *                               'processwire' to render using all languages in processwire
   *                                Default: 'fluency'
   * @return string|null
   * @throws InvalidArgumentException
   */
  public function getLanguageCode(
    ?int $processWireId = null,
    string $languageSource = 'fluency'
  ): ?string {
    $processWireId ??= $this->user->language->id;

    return array_reduce(
      $this->getLanguagesForMarkup($languageSource),
      fn ($code, $language) => $iso = $language->id === $processWireId ? strtolower($language->code)
                                                                       : $code
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
   * To use ProcessWire languages it is necessary to add an additional text field called
   * `language_code` to the `language` system template and provide values for each language.
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
   * #pw-group-Page-And-Markup-Utilities
   *
   * @param  string $languageSource 'fluency' to render using Fluency configured languages or
   *                              'processwire' to render using all languages in processwire
   *                              Default: 'fluency'
   * @return string
   * @throws InvalidArgumentException
   */
  public function renderAltLanguageMetaLinkTags(string $languageSource = 'fluency'): string {
    $languages = $this->getLanguagesForMarkup($languageSource);

    $allTags = array_map(
      fn($language) => Markup::altLanguageLink(
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
   * To use ProcessWire languages it is necessary to add an additional text field called
   * `language_code` to the `language` system template and provide values for each language.
   * Languages without a value will not be rendered in the markup.
   *
   *
   * #pw-group-Page-And-Markup-Utilities
   *
   * @param  bool $addInline       Include inline JS that navigates on select
   * @param  string $id            Optional value for `<select>` id attribut
   * @param  string|array $classes Optional value for `<select>` id attribut
   * @param  string $languageSource 'fluency' to render using Fluency configured languages or
   *                                   'processwire' to render using all languages in processwire
   *                                    Default: 'fluency'
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
      fn($tags, $language) => $tags .= Markup::selectOption(
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
   * #pw-group-Page-And-Markup-Utilities
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
    $divider && $divider = Markup::li(content: $divider, classes: 'divider');

    $items = array_reduce($languages, function($tags, $language) use ($activeClass, $divider) {
      $tags[] = Markup::li(
          classes: $language->isCurrentLanguage ? $activeClass : null,
          content: Markup::a(
            href: $this->page->localUrl($language->id),
            content: $language->title,
          )
      );

      $divider && $tags[] = $divider;

      return $tags;
    }, []);

    end($items) === $divider && array_pop($items);

    return Markup::ul(items: $items, classes: $classes ?? '', id: $id);
  }

  /**
   * Gets languages for markup
   *
   * @param  string $source Either 'fluency' or 'processwire'
   * @throws InvalidArgumentException
   */
  private function getLanguagesForMarkup(string $source = 'fluency'): array {
    return match ($source) {
      'fluency' => $this->getFluencyLanguagesForMarkup(),
      'processwire' => $this->getProcessWireLanguagesForMarkup(),
      default => throw new InvalidArgumentException(
        "Argument passed must be either 'fluency' or 'processwire', '{$source}' given"
      ),
    };
  }

  /**
   * Creates an array of data consumed by ___renderAltLanguageLinkTags
   */
  private function getProcessWireLanguagesForMarkup(): array {
    $this->fields->get('language_code');
    $languageFields = $this->templates->get('name=language')->fields;
    $fieldNames = array_values($this->fieldgroups->getFieldNames($languageFields));

    if (!in_array('language_code', $fieldNames)) {
      throw new InvalidArgumentException(
        "Failed to render alt language link tags for ProcessWire languages. A text field with the name 'code' must be added to the ProcessWire 'language' system template"
      );
    }

    $languages = array_map(
      fn($language) => !$language->code ? null : (object) [
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
   * Creates an array of data consumed by ___renderAltLanguageLinkTags
   */
  private function getFluencyLanguagesForMarkup(): array {
    return array_map(
      fn($language) => (object) [
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
  public function getCachedTranslationsCount(): int {
    return $this->translationCache->count();
  }

  /**
   * Clear all cached translations for the currently selected Translation Engine
   *
   * #pw-group-Caching
   *
   * @return int The number of cached translations, zero indicates success
   */
  public function clearTranslationCache(): int {
    return $this->translationCache->clear();
  }

  /**
   * Clear cached translatable languages list for the currently selected Translation Engine
   *
   * Cached language lists are automatically cleared weekly by default. If a translation service has
   * released new languages but are not appearing within Fluency as avalable, clear this cache.
   *
   * Translation Engine languages are cached for one week.
   *
   * NOTE: This clears the translatable languages cached for all Translation Engines
   *
   * #pw-group-Caching
   *
   * @return int Number of cached translatable languages, zero indicates success
   */
  public function clearTranslatableLanguagesCache(): int {
    return $this->engineLanguagesCache->clear();
  }

  /**
   * Determine if translatable languages are currently cached

   * #pw-group-Caching
   *
   * @return bool
   */
  public function translatableLanguagesAreCached(): bool {
    return (bool) $this->engineLanguagesCache->count();
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
   * $result->error;                     // => null or Fluency\App\FluencyErrors constant value
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
   * @param  string $sourceLanguage  Translation language code
   * @param  string $targetLanguage  Translation language code
   * @param  string|array $content   Multiple translations in an array are per-Engine based on translation service
   * @param  array $options          Additional options defined and used by the Translation Engine
   * @param  bool $caching           Can override module config per-request
   * @return EngineTranslationData
   *
   * Reference `Fluency/app/DataTransferObjects/EngineTranslationData.php`
   * and `Fluency/app/DataTransferObjects/EngineLanguageData.php`
   * and `Fluency/App/FluencyErrors.php`
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

    if (!$source || !$target) {
      $requestData['error'] = !$source ? FluencyErrors::FLUENCY_UNKNOWN_SOURCE
                                       : FluencyErrors::FLUENCY_UNKNOWN_TARGET;

      return EngineTranslationData::fromArray($requestData);
    }

    $translationRequest = TranslationRequestData::fromArray($requestData);

    if ($caching ?? $this->fluencyConfig->translation_cache_enabled) {
      return $this->translationCache->getOrStoreNew(
        $translationRequest,
        fn() => $this->translationEngine->translate($translationRequest)
      );
    }

    return $this->translationEngine->translate($translationRequest);
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
   * #pw-group-Translation-Engine-Interface
   *
   * @return EngineApiUsageData
   *
   * Reference `Fluency/app/DataTransferObjects/EngineApiUsageData.php`
   * and `Fluency/app/FluencyErrors.php`
   */
  public function getTranslationApiUsage(): EngineApiUsageData {
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
   * #pw-group-Translation-Engine-Interface
   *
   * @return EngineTranslatableLanguagesData
   *
   * Reference `Fluency/app/DataTransferObjects/EngineTranslatableLanguagesData.php`
   */
  public function getTranslatableLanguages(): EngineTranslatableLanguagesData {
      return $this->engineLanguagesCache->getOrStoreNew(
        $this->translationEngineInfo->configId,
        fn() => $this->translationEngine->getLanguages()
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
   * @return EngineInfoData|null
   *
   * Reference `Fluency/app/DataTransferObjects/EngineInfoData.php`
   */
  public function getTranslationEngineInfo(): ?EngineInfoData {
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
  public function getApiEndpoints(): stdClass {
    return (object) [
      'endpoints' => "{$this->urls->admin}fluency/api/",
      'usage' => "{$this->urls->admin}fluency/api/usage/",
      'translation' => "{$this->urls->admin}fluency/api/translation/",
      'languages' => "{$this->urls->admin}fluency/api/languages/",
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
  public function ___execute(bool $renderToString = true): InputfieldWrapper|string {
    $wrapper = $this->modules->InputfieldWrapper;
    $wrapper->addClass('fluency-admin-view');

    $this->initializeTranslationEngine();

    $wrapper->import(StandaloneTranslatorFieldset::render());

    if ($this->translationEngineIsReady() && $this->translationEngineInfo->providesUsageData) {
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
  public function executeApi(): void {
    match ($this->input->urlSegment2) {
      'translation' => $this->apiTranslateEndpoint(),
      'usage' => $this->apiTranslationServiceUsageEndpoint(),
      'languages' => $this->apiLanguagesEndpoint(),
      'cache' => $this->apiCacheEndpoint(),
      default => $this->apiRootEndpoint()
    };
  }

  private function apiRootEndpoint(): void {
    $this->validateRequestedEndpoint('GET', 1);

    $this->emitApiResponse(200, $this->getApiEndpoints());
  }

  /**
   * Endpoint: /{admin-slug}/fluency/api/translate
   *
   * @param  string $method HTTP request method
   */
  private function apiTranslateEndpoint(): void {
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
  private function apiTranslationServiceUsageEndpoint(): void {
    $this->validateRequestedEndpoint('GET', 2);

    $data = $this->getTranslationApiUsage();
    $error = $this->getTranslationApiUsage()->error;

    if ($error === FluencyErrors::FLUENCY_NOT_IMPLEMENTED) {
      $this->emitApiError(501, $error);
    }

    $this->emitApiResponse(200, $data);
  }

  /**
   * Endpoint: /{admin-slug}/fluency/api/languages
   *
   * @param  string $method HTTP request method
   */
  private function apiLanguagesEndpoint(): void {
    $this->validateRequestedEndpoint('GET', 2);
    $this->emitApiResponse(200, $this->getTranslatableLanguages());
  }

  /**
   * Endpoint: /{admin-slug}/fluency/api/cache/translations
   * Endpoint: /{admin-slug}/fluency/api/cache/languages
   *
   * @param  string $method HTTP request method
   */
  private function apiCacheEndpoint(): void {
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

        !$this->clearTranslatableLanguagesCache() && $this->emitApiResponse(204);

        $this->emitApiError(500, FluencyErrors::FLUENCY_MODULE_ERROR);
        break;
      default:
        $this->emitApiError(404, FluencyErrors::FLUENCY_NOT_FOUND);
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
  private function emitApiError(int $status, string $fluencyError): void {
    $this->emitApiResponse($status, [
      'error' => $fluencyError,
      'message' => FluencyErrors::getMessage($fluencyError)
    ]);
  }

  /**
   * Creates a response and outputs JSON payload
   *
   * @param  int    $status HTTP status code, i.e. 200
   * @param  mixed  $data   Data to return
   */
  private function emitApiResponse(int $status, mixed $returnData = null): void {
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
      $this->emitApiError(405, FluencyErrors::FLUENCY_METHOD_NOT_ALLOWED);
    }

    if (!is_null($maxEndpointDepth) && count($this->input->urlSegments) > $maxEndpointDepth) {
      $this->emitApiError(404, FluencyErrors::FLUENCY_NOT_FOUND);
    }
  }
}
