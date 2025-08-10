import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtConfig from '../global/FtConfig';
import FtInputfields from './FtInputfields';
import FtInputfieldTranslateButton from '../ui/FtInputfieldTranslateButton';
import FtLanguageTab from '../ui/FtLanguageTab';

/**
 * Handles IO operations for a multilanguage InputfieldPageName element
 * The InputfieldPageName element has special considerations compared to other fields as they do not
 * have the same markup structure.
 * Some actions are internalized here, such as
 * @param {Element} inputfield The Inputfield .InputfieldPageName container
 */
const FtInputfieldPageName = function (inputfield) {
  /**
   * Page-load values for all fields/languages
   * Populated on object instantiation
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */
  const initValues = {};

  /**
   * Will contain new values for fields/languages when content is modified
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */
  const changedValues = {};

  /**
   * FtLanguageTab objects for each language
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */
  const languageTabs = {};

  /**
   * Will contain all elements containing language inputs
   * @property {String} ProcessWire Language ID
   * @type {NodeList}
   */
  const inputContainers = {};

  /**
   * Text input fields
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */
  const languageFields = {};

  let contentModifiedClass = new FtLanguageTab().getContentModifiedClass();

  /**
   * Activity overlays by language IDs
   * @access public
   * @type {Object}
   */
  let activityOverlays = {};

  /*
   * Return null to signal that the overlay should be by language ID
   *
   * @access public
   * @return {Object|Null}
   */
  this.getActivityOverlay = languageId => {
    if (!languageId) {
      return null;
    }

    return activityOverlays[languageId].getActivityOverlay();
  };

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
   * @param  {String|Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */
  this.getValueForLanguage = languageId => this.getFieldForLanguage(languageId).value;

  /**
   * @access public
   * @param  {String|Int} languageId ProcessWire language ID
   * @param  {Mixed}      value      Value to insert into field
   * @return {Bool}                  Content is different from page load value
   */
  this.setValueForLanguage = (languageId, value) => {
    const field = this.getFieldForLanguage(languageId);

    FtInputfields.updateValue(field, value);

    // Required to programmatically trigger the event listener for this field
    field.dispatchEvent(new Event('keyup'));

    // Vanilla JS events are not visible to jQuery and vice-versa
    // This is likely not an issue in the UI, but triggered as a precaution
    $(field).trigger('change');

    return this.contentHasChanged(languageId);
  };

  /**
   * @access private
   * @param  {String|Int}  languageId ProcessWire language ID
   * @return {Element}                Text field
   */
  this.getFieldForLanguage = languageId => {
    if (Object.hasOwn(languageFields, languageId) && !!languageFields[languageId]) {
      return languageFields[languageId];
    }

    languageFields[languageId] =
      this.getInputContainerForLanguage(languageId).querySelector('input');

    return languageFields[languageId];
  };

  /**
   * Gets a specific input container
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */
  this.getInputContainerForLanguage = languageId => {
    if (!Object.hasOwn(inputContainers, languageId) && !inputContainers[languageId]) {
      this.getInputContainers();
    }

    return inputContainers[languageId];
  };

  /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */
  this.getInputContainers = () => {
    // Page name fields require querying the child input and determining the language by analyzing
    // the name attribute of the text input itself
    this.getSelf()
      .querySelectorAll('.LanguageSupport')
      .forEach(el => {
        // The default language input has no language ID, it's the default language, so fallback
        const languageId =
          el.querySelector('input[type=text]').name.replace('_pw_page_name', '') ||
          FtConfig.getDefaultLanguage().id;

        inputContainers[languageId] = el;
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

  this.setModifiedState = (languageId, contentHasChanged) => {
    const inputContainer = this.getInputContainerForLanguage(languageId);

    if (contentHasChanged) {
      inputContainer.classList.add(contentModifiedClass);
    }

    if (!contentHasChanged) {
      inputContainer.classList.remove(contentModifiedClass);
    }
  };

  /**
   * Registers the event listener that watches for changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */
  this.registerInputEventListener = languageId => {
    this.getFieldForLanguage(languageId).addEventListener('keyup', e => {
      changedValues[languageId] = e.target.value;
      this.setModifiedState(languageId, this.contentHasChanged(languageId));
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
    const allInputContainers = this.getInputContainers();

    for (let languageId in allInputContainers) {
      let inputContainer = allInputContainers[languageId];

      initValues[languageId] = this.getValueForLanguage(languageId);
      activityOverlays[languageId] = new createActivityOverlay(inputContainer);

      this.registerInputEventListener(languageId);
    }

    new FtInputfieldTranslateButton(this, allInputContainers, true);
  })();
};

const createActivityOverlay = function (languageInput) {
  let activityOverlay;

  this.getSelf = () => languageInput;

  this.getActivityOverlay = () => activityOverlay;

  (() => {
    activityOverlay = new FtActivityOverlay(this);
  })();
};

export default FtInputfieldPageName;
