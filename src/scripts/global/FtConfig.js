/**
 * This provides access methods to get module configuration values
 * @return {Object}  Public methods
 */
const FtConfig = (function () {
  // Public properties

  const fieldInitializedAttr = 'data-ft-initialized';

  const translationActionTypes = {
    each: 'translate_each_language',
    all: 'translate_to_all_languages',
    both: 'both',
  };

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
   * Classes for elements created in UI
   * @type {Object}
   */
  const elementClasses = {
    translateButton: {
      container: 'ft-translate-button-container',
      button: 'ft-translate-button',
    },
    translateAllButton: {
      container: 'Inputfield InputfieldHeaderHidden',
      content: 'InputfieldContent',
      button: 'ft-translate-all-button',
    },
    statusPlaceholder: {
      container: 'ft-translation-status-container',
      label: 'ft-translation-status',
    },
    icon: 'ft-icon',
  };

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
    languageTranslator: localizedStrings.languageTranslator,
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

  /**
   * Get all configured languages
   * @return {object}
   */
  const getConfiguredLanguages = () => configuredLanguages;

  /**
   * Returns ProcessWire's default language
   * @return {object}
   */
  const getDefaultLanguage = () =>
    getConfiguredLanguages().reduce(
      (defaultLang, lang) => (lang.default ? lang : defaultLang),
      null,
    );

  /**
   * Determines if the language with a given ProcessWire ID can be translated
   * @param  {int|string} languageId ProcessWire language ID
   * @return {bool}
   */
  const languageIsTranslatable = languageId =>
    !getUnconfiguredLanguages().includes(parseInt(languageId, 10));

  /**
   * Get all languages not configured in Fluency
   * @return {object}
   */
  const getUnconfiguredLanguages = () => unconfiguredLanguages;

  /**
   * Gets total count of configured and unconfigured languages
   * @return {int}
   */
  const getLanguageCount = () =>
    getConfiguredLanguages().length + getUnconfiguredLanguages().length;

  /**
   * Get a configured language by it's ProcessWire ID
   * @param  {string|int} pwLanguageId ProcessWire language ID
   * @return {object}
   */
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

  /**
   * Accessor method for localized UI strings
   * @param  {string} key Object key
   * @return {string}
   */
  const getUiTextFor = key => strings[key];

  /**
   * Module Configuration/State
   */

  /**
   * Determines if Fluency JS should initialize based on whether languages have
   * been configured
   * @return {bool}
   */
  const moduleShouldInitialize = () => getConfiguredLanguages().length > 1;

  /**
   * Returns the translation engine config object for the engine configured in Fluency
   * @return {object|null}
   */
  const getEngineInfo = () => config.engine;

  /**
   * Does this engine provide usage data?
   * @return {bool}
   */
  const getEngineProvidesUsageData = () => getEngineInfo().providesUsageData;

  /**
   * Gets the type of translation action chosen in the Flunecy module config
   * @return {string}
   */
  const getTranslationAction = () => config.interface.inputfieldTranslationAction;

  const getElementClassesFor = element => elementClasses[element];

  return {
    fieldInitializedAttr,
    getApiEndpointFor,
    getConfiguredLanguages,
    getDefaultLanguage,
    getElementClassesFor,
    getEngineInfo,
    getEngineProvidesUsageData,
    getLanguageCount,
    getLanguageForId,
    getTranslationAction,
    getUiTextFor,
    getUnconfiguredLanguages,
    languageIsTranslatable,
    moduleShouldInitialize,
    translationActionTypes,
  };
})();

export default FtConfig;
