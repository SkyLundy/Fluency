<?php

namespace Fluency\Services;

use function ProcessWire\wire;

// File must be imported before use, does not work with namespacing
require_once(wire('config')->paths('ProcessLanguageTranslator') . 'LanguageParser.php');

use ProcessWire\{ Fluency, Language, LanguageParser, LanguageTranslator };
use Fluency\DataTransferObjects\ConfiguredLanguageData;
use \InvalidArgumentException;
use \RuntimeException;
use stdClass;

class FluencyProcessWireFileTranslator {

  private Language $defaultPwLanguage;

  private LanguageTranslator $defaultPwLanguageTranslator;

  private ?ConfiguredLanguageData $defaultFluencyLanguage;

  private string $rootDirectory;

  private string $filesDirectory;

  private string $adminUrl;

  public function __construct(
    private Fluency $fluency
  ) {
    if (!!$fluency->fluencyConfig) {
      $this->init();
    }
  }

  private function init(): void {
    $this->defaultFluencyLanguage = $this->fluency->getConfiguredLanguages()->getDefault();
    $this->defaultPwLanguage = wire('languages')->getDefault();
    $this->defaultPwLanguageTranslator = $this->defaultPwLanguage->translator();
    $this->rootDirectory = wire('config')->paths->root;
    $this->filesDirectory = wire('config')->paths->files;
    $this->adminUrl = rtrim(wire('pages')->get('/')->httpUrl, '/') . wire('urls')->admin;
  }

  /**
   * Translates files used by ProcessWire such as those for templates, modules, or any file
   * that use the __() translation function
   *
   * Example of file array:
   * [
   *   'site/modules/Fluency/app/FluencyLocalization.php',
   *   'site/templates/home.php',
   *   'wire/modules/Inputfield/InputfieldText/InputfieldText.module',
   * ]
   *
   * @param  array  $files     Files to create translations for
   * @param  array<ConfiguredLanguageData>  $languages All languages to translate to
   * @return stdClass Result with number of files and languages translated
   */
  public function translateForProcessWire(array $files, array $languages): stdClass {
    $this->createDefaultTranslations($files);
    $this->translateProcessWireFiles($files, $languages);

    return (object) [
      'files' => count($files),
      'languages' => count($languages) + 1
    ];
  }

  /**
   * Create ProcessWire translation files for the specified files.
   *
   * Example of file array:
   * [
   *   'site/modules/Fluency/app/FluencyLocalization.php',
   *   'site/templates/home.php',
   *   'wire/modules/Inputfield/InputfieldText/InputfieldText.module',
   * ]
   *
   * @param  array<string> $files Files to translate with path from root
   * @param  array<ConfiguredLanguageData> $files Files to translate with path from root
   * @param  bool $overwriteExistingTranslations Re-translate all values
   * @return stdClass Result with number of files and languages translated
   * @throws InvalidArgumentException
   */
  private function translateProcessWireFiles(
    array $files,
    array $languages,
    bool $overwriteExistingTranslations = false
  ): stdClass {
    $defaultPwTranslator = $this->defaultPwLanguageTranslator;

    // Check that both the files to be translated and their default translation (textdomain) files
    // exist. Throws exceptions
    $this->checkFilesToTranslateExist($files);
    $this->checkDefaultLanguageFilesExist($files, $this->defaultPwLanguage->id, $defaultPwTranslator);

    if ($overwriteExistingTranslations) {
      foreach ($languages as $language) {
        $this->deleteLanguageTranslationFiles($files, $language);
      }
    }

    // Get all source values and convert to an array of {hash} => {string}
    $sourceValues = array_map(function($file) use ($defaultPwTranslator) {
      $translations = $defaultPwTranslator->getTranslations($file);

      array_walk($translations, fn(&$v) => $v = $v['text']);

      return $translations;
    }, $files);

    $sources = array_combine($files, $sourceValues);

    $this->checkSourceContentExists($sources);

    foreach ($sources as $file => $values) {
      $this->translateFile($file, $values, $languages);
    }

    return (object) [
      'files' => count($files),
      'languages' => count($languages)
    ];
  }

  /**
   * Create ProcessWire translation files for default language. These are required to be present and
   * contain values to translate specified files into other languages using this class.
   * @param array $files Array of files to create default language translations
   * @return stdClass Object with number of files and languages translated
   */
  private function createDefaultTranslations(array $files): stdClass {
    $this->checkFilesToTranslateExist($files);
    $translator = $this->defaultPwLanguage->translator();

    // This is an inexpensive operation, we can delete the default files and re-create since this
    // only inserts current strings as found when files are parsed
    $this->deleteLanguageTranslationFiles($files, $this->defaultFluencyLanguage);

    $values = array_map(fn($file) => $this->getUntranslatedValues($translator, $file), $files);

    $sources = array_combine($files, $values);

    foreach ($sources as $file => $values) {
      $this->saveModuleFileTranslations($this->defaultFluencyLanguage, $file, $values);
    }

    return (object) [
      'files' => count($files),
      'languages' => 1
    ];
  }

  /**
   * Checks that translation files exists for given files in the default language
   * @param  array<string>    $files Files where translation is desired
   * @return void
   * @throws RuntimeException
   */
  private function checkDefaultLanguageFilesExist(array $files): void {
    foreach ($files as $file) {
      if ($this->defaultLanguageFileExists($file)) {
        continue;
      }

      $editUrl = "{$this->adminUrl}setup/languages/edit/?id={$this->defaultPwLanguage->id}";

      throw new InvalidArgumentException(
        "A ProcessWire translation file for '{$file}' does not exist in the default language. Create one here: {$editUrl}"
      );
    }
  }

  /**
   * Checks that a translation file (textdomain) exists for a file in the default language
   * @param  string $file File to check
   * @return bool
   */
  private function defaultLanguageFileExists(string $file): bool {
    $defaultPwTranslator = $this->defaultPwLanguage->translator();
    $textdomain = $defaultPwTranslator->filenameToTextdomain($file);

    return $defaultPwTranslator->textdomainFileExists($textdomain);
  }

  /**
   * Deletes a default translation (textdomain) file for a file to be translated if it exists
   * @param  string|array $files File(s) to translate
   * @param  ConfiguredLanguageData $language Language to delete translation file for
   * @return void
   */
  private function deleteLanguageTranslationFiles(
    array|string $files,
    ConfiguredLanguageData $language
  ): void {
    $files = (array) $files;

    foreach ($files as $file) {
      if (!$this->defaultLanguageFileExists($file)) {
        return;
      }

      $translator = $this->defaultPwLanguage->translator();
      $textdomain = $translator->filenameToTextdomain($file);
      $targetFile = "{$this->filesDirectory}{$language->id}/{$textdomain}.json";

      $translator->textdomainFileExists($textdomain) && unlink($targetFile);
    }
  }

  /**
   * Parse a file to translate to get all untranslated values
   * Used only to get values for default language
   * Translating to target languages requires that these values exist in a translation file for the
   * default language
   * @param  LanguageTranslator $translator Language translator object
   * @param  string             $file       File to parse
   * @return array
   */
  private function getUntranslatedValues(LanguageTranslator $translator, string $file): array {
    return (new LanguageParser($translator, "{$this->rootDirectory}{$file}"))->getUntranslated();
  }

  /**
   * Whoa there, cowboy! Let's make sure the files you're trying to translate exist
   * @param  array  $files Files where translation is desired
   * @return void
   * @throws InvalidArgumentException
   */
  private function checkFilesToTranslateExist(array $files): void {
    foreach ($files as $file) {
      $file = "{$this->rootDirectory}{$file}";

      !file_exists($file) && throw new InvalidArgumentException("'{$file}' does not exist");
    }
  }

  /**
   * Check that values exist in the default language translation file
   * @param  array  $sources File/translatable values
   * @return void
   */
  private function checkSourceContentExists(array $sources): void {
    foreach ($sources as $file => $values) {
      empty($values) && throw new RuntimeException(
        "There are no values saved for strings in the default language for {$file}. Create " .
        "default values by saving the default strings in the language translator page for {$file}"
      );
    }
  }

  /**
   * Translates the content of a source translation file in the default language to all
   * languages configured in Fluency
   *
   * @param  string $file File with path, see translateProcessWireFiles() method docblock
   * @param  array  $fileContents Contents of file populated with {hash} => {value}
   * @param  array<ConfiguredLanguageData> $targetLanguages Languages to translate to
   * @return void
   */
  private function translateFile(string $file, array $fileContents, array $targetLanguages): void {
    $hashKeys = array_keys($fileContents);
    $sourceStrings = array_values($fileContents);

    foreach ($targetLanguages as $targetLanguage) {
      $translatedStrings = $this->translateFileValues($targetLanguage, $sourceStrings);

      // Re-join translations with respective hashes
      $hashKeyedTranslations = array_combine($hashKeys, $translatedStrings);

      // Save for this file, in this language, with hash keyed values
      $this->saveModuleFileTranslations($targetLanguage, $file, $hashKeyedTranslations);
    }
  }

  /**
   * Executes translations for all module strings for a given language
   * Array of strings passed should be default language file source strings in flat array:
   *
   * [
   *   'Hello, how are you?',
   *   'Fine weather we have today.',
   *   'See you next time'
   * ]
   *
   * @param  ConfiguredLanguageData $target         Target language, Fluency data object
   * @param  array                  $sourceStrings  Array of values to be translated
   * @return array                                  Translated PW values
   * @throws RuntimeException
   */
  private function translateFileValues(
    ConfiguredLanguageData $targetLanguage,
    array $sourceStrings
  ): array {
    // DeepL accepts a maximum of 50 strings to translate in one call
    $chunks = array_chunk($sourceStrings, 50);

    // Get the source/target codes for this translation
    $sourceCode = $this->defaultFluencyLanguage->engineLanguage->sourceCode;
    $targetCode = $targetLanguage->engineLanguage->targetCode;

    // Translate each chunk of 50
    $translations = array_map(function($chunk) use ($sourceCode, $targetCode) {
      $result = $this->fluency->translate($sourceCode, $targetCode, $chunk);

      // Handle a translation problem
      $result->error && throw new RuntimeException($result->message);

      return $result->translations;
    }, $chunks);

    // Flatten the chunked array and return
    return array_merge(...$translations);
  }

  /**
   * Saves all translations for a target language to a ProcessWire translation file
   *
   * @param  ConfiguredLanguageData $targetLanguage   Fluency configured language
   * @param  string                 $file             Full file string
   * @param  array                  $translatedValues Array of values keyed by PW hash
   * @return void
   */
  private function saveModuleFileTranslations(
    ConfiguredLanguageData $targetLanguage,
    string $file,
    array $translatedValues
  ): void {
    $pwLanguage = wire('languages')->get($targetLanguage->id);

    // Required to save language page
    $pwLanguage->of(false);

    // Use ProcessWire's built in LanguageTranslator class for this langauge
    // This will handle writing values to the PW translation file
    $pwTranslator = $pwLanguage->translator();

    // Adds the file if it doesn't exist
    $textdomain = $pwTranslator->addFileToTranslate($file);

    // Tells ProcessWire to write to this language's file/domain
    $pwTranslator = $pwTranslator->loadTextdomain($textdomain);

    foreach ($translatedValues as $hash => $value) {
      $pwTranslator->setTranslationFromHash($textdomain, $hash, $value);
    }

    $pwTranslator->saveTextdomain($textdomain);
  }
}