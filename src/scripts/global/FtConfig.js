/**
 * This provides access methods to get module configuration values
 * @return {Object}  Public methods
 */
const FtConfig = (function () {
  // Public properties

  const fieldInitializedAttr = 'data-ft-initialized';

  // Private properties

  /**
   * Holds the data passed from the Fluency module
   * @access Private
   * @type {Object}
   */
  const config = ProcessWire.config.fluency;

  /**
   * All UI strings
   * @type {Object}
   */
  const localizedStrings = config.localization;

  /**
   * Objects interface with the Fluency config object so that changes to the object
   * structure from the back end do not break the UI. Use the public methods below
   * to access ProcessWire.config.fluency properties and data
   */

  /**
   * Localized strings keyed sets
   * @type {Object}
   */
  const strings = {
    activityOverlay: localizedStrings.activityOverlay,
    languageSelect: localizedStrings.languageSelect,
    inputfieldTranslateButtons: localizedStrings.inputfieldTranslateButtons,
    standaloneTranslator: localizedStrings.standaloneTranslator,
    usage: localizedStrings.usage,
    errors: localizedStrings.errors,
  };

  /**
   * Fluency API keyed URLs
   * @type {Object}
   */
  const endpoints = {
    languages: config.apiEndpoints.languages,
    translatableLanguagesCache: config.apiEndpoints.translatableLanguagesCache,
    test: config.apiEndpoints.test,
    translation: config.apiEndpoints.translation,
    translationCache: config.apiEndpoints.translationCache,
    usage: config.apiEndpoints.usage,
  };

  /**
   * Contains all of the Fluency configured langauges from the module
   * @type {Array}
   */
  const configuredLanguages = config.configuredLanguages;

  /**
   * Contains an array of ProcessWire language IDs not configured in Fluency
   * @type {Array}
   */
  const unconfiguredLanguages = config.unconfiguredLanguages;

  // Public methods

  /**
   * Fluency REST API
   */
  const getApiEndpointFor = key => endpoints[key];

  /**
   * Languages
   */

  const getConfiguredLanguages = () => configuredLanguages;

  const getDefaultLanguage = () =>
    getConfiguredLanguages().reduce(
      (defaultLang, lang) => (lang.default ? lang : defaultLang),
      null,
    );

  const languageIsTranslatable = languageId =>
    !getUnconfiguredLanguages().includes(parseInt(languageId, 10));

  const getUnconfiguredLanguages = () => unconfiguredLanguages;

  const getLanguageCount = () =>
    getConfiguredLanguages().length + getUnconfiguredLanguages().length;

  const getLanguageForId = pwLanguageId => {
    pwLanguageId = parseInt(pwLanguageId, 10);

    return getConfiguredLanguages().reduce(
      (match, language) => (language.id === pwLanguageId ? language : match),
      null,
    );
  };

  /**
   * Localization
   */

  const getUiTextFor = key => strings[key];

  /**
   * Module Configuration/State
   */

  const moduleShouldInitialize = () => getConfiguredLanguages().length > 1;

  const getEngineInfo = () => config.engine;

  const getEngineProvidesUsageData = () => getEngineInfo().providesUsageData;

  const getTranslationAction = () => config.interface.inputfieldTranslationAction;

  /**
   * Translation types. No magic strings.
   */
  const translationActionTypes = {
    each: 'translate_each_language',
    all: 'translate_to_all_languages',
  };

  return {
    fieldInitializedAttr,
    getApiEndpointFor,
    getConfiguredLanguages,
    getDefaultLanguage,
    getEngineInfo,
    getEngineProvidesUsageData,
    getTranslationAction,
    getLanguageCount,
    getLanguageForId,
    getUiTextFor,
    getUnconfiguredLanguages,
    languageIsTranslatable,
    moduleShouldInitialize,
    translationActionTypes,
  };
})();

export default FtConfig;
