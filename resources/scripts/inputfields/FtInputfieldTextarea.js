import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtConfig from '../global/FtConfig';
import FtInputfields from './FtInputfields';
import FtInputfieldTranslateButton from '../ui/FtInputfieldTranslateButton';
import FtLanguageTab from '../ui/FtLanguageTab';

/**
 * Determines if the current inputfield is an InputfieldText
 * @param  {Element} inputfield Element containing the multilanguage fields
 * @return {Bool}
 */
const FtIsInputfieldTextarea = inputfield =>
  !!inputfield.querySelector('textarea:not(.InputfieldCKEditorNormal,.InputfieldTinyMCEEditor)');

/**
 * Handles IO operations for a multilanguage InputfieldText element
 * Language IDs are always converted to int to accept values from all sources since some may be
 * retrieved from various sources as a string
 * @param {Element} inputfield The Inputfield .hasLangTabs container
 */
const FtInputfieldTextarea = function (inputfield) {
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
   * Will contain all language input text fields keyed by language ID
   * @type {Object}
   */
  const languageFields = {};

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
   * @return {Element} Inputfield element passed to this object on creation
   */
  this.getSelf = () => inputfield;

  /**
   * @return {Mixed}
   */
  this.getValueForDefaultLanguage = () =>
    this.getValueForLanguage(FtConfig.getDefaultLanguage().id);

  /**
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */
  this.getValueForLanguage = languageId => this.getFieldForLanguage(languageId).value;

  /**
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */
  this.setValueForLanguage = (languageId, value) => {
    const field = this.getFieldForLanguage(languageId);

    FtInputfields.updateValue(field, value);

    // Required to programmatically trigger the event listener for this field
    field.dispatchEvent(new Event('keyup'));

    // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
    // modules and admin JS listeners work
    $(field).trigger('change');

    return this.contentHasChanged(languageId);
  };

  /**
   * @param  {Int}    languageId ProcessWire language ID
   * @return {Element}           Text field
   */
  this.getFieldForLanguage = languageId => {
    if (Object.hasOwn(languageFields, languageId)) {
      return languageFields[languageId];
    }

    languageFields[languageId] = inputfield.querySelector(
      `[data-language="${languageId}"] textarea`,
    );

    return languageFields[languageId];
  };

  /**
   * Get all input containers where content is entered, memoizes
   * @return {Object} All languages keyed by (int) language ID
   */
  this.getInputContainers = () => {
    inputfield.querySelectorAll('[data-language]').forEach(el => {
      inputContainers[el.dataset.language] = el;
    });

    return inputContainers;
  };

  /**
   * @param  {Int} languageId ProcessWire language ID
   * @return {Bool}
   */
  this.contentHasChanged = languageId =>
    Object.hasOwn(changedValues, languageId) &&
    changedValues[languageId] !== initValues[languageId];

  /**
   * Registers the event listener that watches for changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */
  this.registerInputEventListener = languageId => {
    this.getFieldForLanguage(languageId).addEventListener('keyup', e => {
      changedValues[languageId] = e.target.value;
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
    const allInputContainers = this.getInputContainers();

    for (let languageId in allInputContainers) {
      let inputContainer = allInputContainers[languageId];

      initValues[languageId] = this.getValueForLanguage(languageId);
      languageTabs[languageId] = new FtLanguageTab(inputContainer);

      this.registerInputEventListener(languageId);
    }

    activityOverlay = new FtActivityOverlay(this);

    new FtInputfieldTranslateButton(this, allInputContainers);
  })();
};

export { FtIsInputfieldTextarea, FtInputfieldTextarea };
