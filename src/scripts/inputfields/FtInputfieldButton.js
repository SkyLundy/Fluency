import FtInputfields from './FtInputfields';
import FtConfig from '../global/FtConfig';

/**
 * Determines if the current inputfield is an InputfieldText
 * @param  {Element} inputfield Element containing the multilanguage fields
 * @return {Bool}
 */
const FtIsInputfieldButton = inputfield => !!inputfield.querySelector("input[type='text']");

/**
 * Handles IO operations for a multilanguage InputfieldText element
 * Language IDs are always converted to int to accept values from all sources since some may be
 * retrieved from various sources as a string
 * @param {Element} inputfield The Inputfield .hasLangTabs container
 */
const FtInputfieldText = function (inputfield) {
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
    field.dispatchEvent(new Event('input'));

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
    if (Object.hasOwn(inputContainers, languageId) && !!inputContainers[languageId]) {
      return inputContainers[languageId];
    }

    inputContainers[languageId] = inputfield.querySelector(`[data-language="${languageId}"]`);

    return inputContainers[languageId];
  };

  /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */
  this.getInputContainers = () => {
    if (Object.keys(inputContainers).length === FtConfig.getLanguageCount()) {
      return inputContainers;
    }

    inputfield
      .querySelectorAll('[data-language]')
      .forEach(el => (inputContainers[el.dataset.language] = el));

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
   * Registers the event listener that watches for changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */
  this.registerInputEventListener = languageId => {
    this.getFieldForLanguage(languageId).addEventListener('input', e => {
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
  })();
};

export { FtIsInputfieldButton, FtInputfieldText };
