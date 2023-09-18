import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtConfig from '../global/FtConfig';
import FtInputfields from './FtInputfields';
import FtInputfieldTranslateButton from '../ui/FtInputfieldTranslateButton';
import FtLanguageTab from '../ui/FtLanguageTab';

/**
 * Determines if a given inputfield contains a regular CKEditor instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */
const FtIsInputfieldCKEditor = inputfield =>
  !!inputfield.querySelector('.InputfieldCKEditorNormal');

/**
 * Handles translations for CKEditor Inputfields
 * @return {object}  Public methods
 */
const FtInputfieldCKEditor = function (inputfield) {
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
   * Will contain all CKEditor instances
   * @property {String} ProcessWire Language ID
   * @value    {CKEditor|null}
   * @type     {Object}
   */
  const editorInstances = {};

  /**
   * Will contain the base CKEditor instance ID that can be used to get the default CKEditor instance
   * using the CKEditor API, or another instance by modifying this one.
   * Set on FtInputfieldCKEditor instantiation
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

  /**
   * Gets existing or instantiates a new activity overlay
   *
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
  this.getValueForLanguage = languageId => this.getEditorInstanceForLanguage(languageId).getData();

  /**
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */
  this.setValueForLanguage = (languageId, value) => {
    const instance = this.getEditorInstanceForLanguage(languageId);

    instance.setData(value);
    instance.fire('change');

    return this.contentHasChanged(languageId);
  };

  /**
   * Attempts to get the CKEditor instance for a given language ID. This method should
   * be used exclusively to get instances as it also sets event listeners for content
   * changes if they have been instantiated after FtInputfieldCKEditor has loaded
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?CKEditor}
   */
  this.getEditorInstanceForLanguage = languageId => {
    if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) {
      return editorInstances[languageId];
    }

    const ckeditorSelector = this.createCKEditorSelector(languageId);

    editorInstances[languageId] = CKEDITOR.instances[ckeditorSelector];

    return editorInstances[languageId];
  };

  /**
   * Creates a CKEditor ID used to get instances by language
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {String}
   */
  this.createCKEditorSelector = languageId => {
    if (languageId == FtConfig.getDefaultLanguage().id) {
      return defaultLanguageInstanceId;
    }

    return `${defaultLanguageInstanceId}__${languageId}`;
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
   * @access private
   * @param  {Int} languageId ProcessWire language ID
   * @return {Bool}
   */
  this.contentHasChanged = languageId =>
    Object.hasOwn(changedValues, languageId) &&
    changedValues[languageId] !== initValues[languageId];

  /**
   * Registers the event listener that watches for content changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {void}
   */
  this.registerInputEventListener = languageId => {
    this.getEditorInstanceForLanguage(languageId).on('change', e => {
      changedValues[languageId] = this.getValueForLanguage(languageId);
      languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
    });
  };

  /**
   * Init on object instantiation
   * @access private
   * @return {Void}
   */
  (() => {
    if (CKEDITOR === undefined) {
      console.error('CKEditor was not found by Fluency, translation unavailable');

      return;
    }

    const allInputContainers = this.getInputContainers();

    defaultLanguageInstanceId = Object.values(allInputContainers)[0].id.replace('langTab_', '');

    for (let languageId in allInputContainers) {
      let inputContainer = allInputContainers[languageId];

      editorInstances[languageId] = this.getEditorInstanceForLanguage(languageId);
      languageTabs[languageId] = new FtLanguageTab(inputContainer);
      this.registerInputEventListener(languageId);
    }

    activityOverlay = new FtActivityOverlay(this);

    new FtInputfieldTranslateButton(this, allInputContainers);
  })();
};

export { FtIsInputfieldCKEditor, FtInputfieldCKEditor };
