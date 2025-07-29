import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtConfig from '../global/FtConfig';
import FtInputfields from './FtInputfields';
import FtInputfieldTranslateButton from '../ui/FtInputfieldTranslateButton';
import FtLanguageTab from '../ui/FtLanguageTab';

/**
 * Determines if a given inputfield contains an inline TinyMCE instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */
const FtIsInputfieldTinyMCEInline = inputfield =>
  !!inputfield.querySelector('.InputfieldTinyMCEInline');

/**
 * Handles translations for TinyMCE Inputfields
 * @return {object}  Public methods
 */
const FtInputfieldTinyMCEInline = function (inputfield) {
  /**
   * Contains values for all fields/languages keyed by ProcessWire language ID.
   * Populated on object instantiation
   * @type {Object}
   */
  const initValues = {};

  /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @type {Object}
   */
  const changedValues = {};

  /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * Language ID keys are integers
   * @type {Object}
   */
  const languageTabs = {};

  /**
   * Will contain all language input containers keyed by language ID
   * Language ID keys are integers
   * @type {NodeList}
   */
  const inputContainers = {};

  /**
   * Will contain all the HTML elements that the inline TinyMCE editor stores/modifies content
   * keyed by language ID
   * @type {Object}
   */
  const contentElements = {};

  /**
   * Will contain all TinyMCE instances as they become available
   * @type {Object}
   */
  const editorInstances = {};

  /**
   * Will contain the TinyMCE instance name for the default language.
   * Used to get the TinyMCE instance
   * @type {?String}
   */
  let defaultLanguageInstanceId = null;

  /**
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
   * @access public
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */
  this.getValueForLanguage = languageId => {
    const tinymceInstance = this.getEditorInstanceForLanguage(languageId);

    if (tinymceInstance) {
      return tinymceInstance.getContent();
    }

    return this.getContentElementForLanguage(languageId).innerHTML;
  };

  /**
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */
  this.setValueForLanguage = (languageId, value) => {
    const contentElement = this.getContentElementForLanguage(languageId);

    // Click event ensures that TinyMCE has been initialized before inserting content
    contentElement.click();

    contentElement.innerHTML = value;

    // Required to programmatically trigger the event listener for this field
    contentElement.dispatchEvent(new Event('input'));

    // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
    // modules and Admin listeners work
    $(contentElement).trigger('change');

    return this.contentHasChanged(languageId);
  };

  /**
   * Attempts to get the TinyMCE instance for a given language ID if it exists
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?TinyMCE}
   */
  this.getEditorInstanceForLanguage = languageId => {
    if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) {
      return editorInstances[languageId];
    }

    const tinymceSelector = this.createTinymceSelector(languageId);

    editorInstances[languageId] = tinymce.get(tinymceSelector);

    return editorInstances[languageId];
  };

  /**
   * Gets the content element that TinyMCE uses to store the field content
   * Ensures memoization
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */
  this.getContentElementForLanguage = languageId => {
    if (Object.hasOwn(contentElements, languageId)) {
      return contentElements[languageId];
    }

    contentElements[languageId] =
      this.getInputContainerForLanguage(languageId).querySelector('.mce-content-body');

    return contentElements[languageId];
  };

  /**
   * Gets a specific input container. Memoizes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */
  this.getInputContainerForLanguage = languageId => {
    if (Object.hasOwn(inputContainers, languageId) && !!inputContainers[languageId]) {
      return inputContainers[languageId];
    }

    inputContainers[languageId] = this.getSelf().querySelector(`[data-language="${languageId}"]`);

    return inputContainers[languageId];
  };

  /**
   * Get all input containers where content is entered, memoizes
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
   * Determines if the content for a given langauge has changed. In some instances TinyMCE
   * inserts unwanted elements into empty fields that will always register content as having been
   * changed. This includes adding elements to fields that may be returned to their original content
   * matching content at page load. These "phantom elements" must be checked for.
   * @access private
   * @param  {Int} languageId ProcessWire language ID
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
   * Creates a MutationObserver that will detect when the innerHTML content has changed for a given
   * content element. When content is changed, it will mock an 'input' event that an eventListener
   * can respond to
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */
  this.registerUpdateEvent = languageId => {
    const contentElement = this.getContentElementForLanguage(languageId);

    new MutationObserver((mutations, observer) => {
      for (let mutation of mutations) {
        mutation.target.dispatchEvent(new Event('input'));
      }
    }).observe(contentElement, {
      childList: true,
    });
  };

  /**
   * Register an input observer
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */
  this.registerInputEventListener = languageId => {
    this.getContentElementForLanguage(languageId).addEventListener('input', e => {
      changedValues[languageId] = this.getValueForLanguage(languageId);
      languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
    });
  };

  /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */
  (() => {
    if (tinymce === undefined) {
      console.error('TinyMCE was not found by Fluency, translation unavailable');

      return null;
    }

    const allInputContainers = this.getInputContainers();

    // TinyMCE instances are initialzied using a field ID. The default language element contains
    // an ID substring that can be modified to create a TinyMCE ID string that can be used to get
    // TinyMCE instances
    defaultLanguageInstanceId = Object.values(allInputContainers)[0].id.replace('langTab_', '');

    for (let languageId in allInputContainers) {
      let inputContainer = allInputContainers[languageId];

      initValues[languageId] = this.getValueForLanguage(languageId);
      languageTabs[languageId] = new FtLanguageTab(inputContainer);

      this.registerUpdateEvent(languageId);
      this.registerInputEventListener(languageId);
    }

    activityOverlay = new FtActivityOverlay(this);

    new FtInputfieldTranslateButton(this, allInputContainers);
  })();
};

export { FtIsInputfieldTinyMCEInline, FtInputfieldTinyMCEInline };
