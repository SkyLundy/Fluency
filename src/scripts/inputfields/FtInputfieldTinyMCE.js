import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtConfig from '../global/FtConfig';
import FtInputfields from './FtInputfields';
import FtInputfieldTranslateButton from '../ui/FtInputfieldTranslateButton';
import FtLanguageTab from '../ui/FtLanguageTab';

/**
 * Determines if a given inputfield contains a regular TinyMCE instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */
const FtIsInputfieldTinyMCE = inputfield => !!inputfield.querySelector('.InputfieldTinyMCENormal');

/**
 * Handles IO operations for a multilanguage InputfieldTinyMCE elements
 * @param {Element} inputfield The Inputfield .hasLangTabs container
 */
const FtInputfieldTinyMCE = function (inputfield) {
  /**
   * Contains values for all fields/languages keyed by ProcessWire language ID.
   * Populated on object instantiation
   *
   * @type {Object}
   */
  const initValues = {};

  /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {String} Inputfield content
   * @type {Object}
   */
  const changedValues = {};

  /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type     {Object}
   */
  const languageTabs = {};

  /**
   * Will contain all language input containers keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type {Object}
   */
  const inputContainers = {};

  /**
   * Will contain all language input textarea fields that hold Inputfield data before TinyMCE
   * instances are initialized.
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type     {Object}
   */
  const textareas = {};

  /**
   * Will contain all TinyMCE instances as they become available (are initialized). Most TinyMCE
   * instances are lazy loaded or loaded on demand. Keyed by language ID
   * This is populated on FtInputfieldTinyMCE on instantiation and language ID properties will either
   * have a TinyMCE object or null
   * @property {String} ProcessWire Language ID
   * @value    {TinyMCE|null}
   * @type     {Object}
   */
  const editorInstances = {};

  /**
   * Will contain the base TinyMCE instance ID that can be used to get the default TinyMCE instance
   * using the TinyMCE API, or another instance by modifying this one.
   * Set on FtInputfieldTinyMCE instantiation
   * @type {?String}
   */
  let defaultLanguageInstanceId = null;

  /**
   * Activity overlay object, set on instantiation
   *
   * @access public
   * @type {Object}
   */
  let activityOverlay;

  /*
   * @access public
   * @return {Object}
   */
  this.getActivityOverlay = () => activityOverlay;

  /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */
  this.getSelf = () => inputfield;

  /**
   * @access public
   * @return {Mixed}
   */
  this.getValueForDefaultLanguage = () =>
    this.getValueForLanguage(FtConfig.getDefaultLanguage().id);

  /**
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */
  this.getValueForLanguage = languageId => {
    const tinymceInstance = this.getTinymceInstanceForLanguage(languageId);

    if (tinymceInstance) {
      return tinymceInstance.getContent();
    }

    return this.getTextareaForLanguage(languageId).value;
  };

  /**
   * Sets content for a language, will set the value for TinyMCE if it exists, and always set the
   * value for the textarea
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */
  this.setValueForLanguage = (languageId, value) => {
    const tinymceInstance = this.getTinymceInstanceForLanguage(languageId);

    if (tinymceInstance) {
      tinymceInstance.setContent(value);

      tinymceInstance.fire('input');
    }

    const field = this.getTextareaForLanguage(languageId);

    FtInputfields.updateValue(field, value);

    field.dispatchEvent(new Event('input'));

    return this.contentHasChanged(languageId);
  };

  /**
   * Attempts to get the TinyMCE instance for a given language ID if it exists
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?TinyMCE}
   */
  this.getTinymceInstanceForLanguage = languageId => {
    if (Object.hasOwn(editorInstances, languageId) && editorInstances[languageId]) {
      return editorInstances[languageId];
    }

    const tinymceSelector = this.createTinymceSelector(languageId);

    editorInstances[languageId] = tinymce.get(tinymceSelector);

    return editorInstances[languageId];
  };

  /**
   * @access private
   * @param  {Int}    languageId ProcessWire language ID
   * @return {Element}           Text field
   */
  this.getTextareaForLanguage = languageId => {
    if (Object.hasOwn(textareas, languageId) && !!textareas[languageId]) {
      return textareas[languageId];
    }

    textareas[languageId] = this.getSelf().querySelector(
      `[data-language="${languageId}"] textarea`
    );

    return textareas[languageId];
  };

  /**
   * Get all input containers holding TinyMCE instances, memoizes. Keyed by ID
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */
  this.getInputContainers = () => {
    this.getSelf()
      .querySelectorAll('[data-language]')
      .forEach(el => {
        inputContainers[el.dataset.language] = el;
      });

    return inputContainers;
  };

  /**
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Bool}
   */
  this.contentHasChanged = languageId =>
    Object.hasOwn(changedValues, languageId) &&
    changedValues[languageId] !== initValues[languageId];

  /**
   * Creates a TinyMCE ID used to get instances by language
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {String}
   */
  this.createTinymceSelector = languageId => {
    if (languageId == FtConfig.getDefaultLanguage().id) {
      return defaultLanguageInstanceId;
    }

    return `${defaultLanguageInstanceId}__${languageId}`;
  };

  /**
   * Bind Inputfield required events to a TinyMCE instance
   * @access private
   * @param  {String|Int} languageId      ProcessWire language ID
   * @param  {Object}     tinymceInstance TinyMCE object
   * @return {Void}
   */
  this.bindTinymceEvents = (languageId, tinymceInstance) => {
    tinymceInstance.on('keyup', e =>
      this.getTextareaForLanguage(languageId).dispatchEvent(new Event('input'))
    );
  };

  /**
   * Creates an observer that looks for new TinyMCE instances within this Inputfield
   * @access private
   * @return {void}
   */
  this.initTinymceInstanceOnCreation = (languageId, inputContainer) => {
    new MutationObserver((mutations, observer) => {
      for (let mutation of mutations) {
        let targetEl = mutation.target;

        if (targetEl.dataset.language == languageId) {
          editorInstances[languageId] = this.getTinymceInstanceForLanguage(languageId);
          this.bindTinymceEvents(languageId, editorInstances[languageId]);

          if (editorInstances[languageId]) {
            observer.disconnect();
          }
        }
      }
    }).observe(inputContainer, {
      childList: true,
    });
  };

  /**
   * Registers the event listener that watches for content changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {void}
   */
  this.registerInputEventListener = languageId => {
    textareas[languageId].addEventListener('input', e => {
      changedValues[languageId] = this.getValueForLanguage(languageId);
      languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
    });
  };

  /**
   * Initializes FtInputfieldTinyMCE Inputfield
   * @access private
   * @param  {Array<Element>} allInputContainers All elements containing TinyMCE fields
   * @return {Void}
   */
  this.initAll = allInputContainers => {
    // TinyMCE instances are initialzied using a field ID. The default language element contains
    // an ID substring that can be modified to create a TinyMCE ID string that can be used to get
    // TinyMCE instances
    defaultLanguageInstanceId = Object.values(allInputContainers)[0].id.replace('langTab_', '');

    // At runtime/initialization only the TinyMCE instance will load for the default language, others
    // will be loaded when switched to the tab. Still attempt to get all TinyMCE instances for all
    // tabs in case they are available
    for (let languageId in allInputContainers) {
      const inputContainer = allInputContainers[languageId];

      // Get initial content on page load
      // Call this first to ensure getValueForLanguage() pulls from the textarea element rather than
      // attempting to use the TinyMCE API on object instantiation
      initValues[languageId] = this.getValueForLanguage(languageId);

      languageTabs[languageId] = new FtLanguageTab(inputContainer);

      editorInstances[languageId] = this.getTinymceInstanceForLanguage(languageId);

      textareas[languageId] = this.getTextareaForLanguage(languageId);

      this.registerInputEventListener(languageId);

      // If there was no editor found at initialization, register when created
      if (!editorInstances[languageId]) {
        this.initTinymceInstanceOnCreation(languageId, inputContainer);
      }
    }

    // Bind TinyMCE event listeners to any TinyMCE input fields found on initialization
    for (let languageId in editorInstances) {
      if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) {
        this.bindTinymceEvents(languageId, editorInstances[languageId]);
      }
    }
  };

  /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */
  (() => {
    const allInputContainers = this.getInputContainers();

    // Set a micro timeout to allow TinyMCE instances to instantiate.
    // This is especially important when new fields are dynamically added after page load
    setTimeout(() => {
      this.initAll(allInputContainers);
    }, 50);

    activityOverlay = new FtActivityOverlay(this);

    new FtInputfieldTranslateButton(this, allInputContainers);
  })();
};

export { FtIsInputfieldTinyMCE, FtInputfieldTinyMCE };
