import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtConfig from '../global/FtConfig';
import FtInputfields from './FtInputfields';
import FtInputfieldTranslateButton from '../ui/FtInputfieldTranslateButton';
import FtLanguageTab from '../ui/FtLanguageTab';

/**
 * Determines if a given inputfield contains an inline CKEditor instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */
const FtIsInputfieldCKEditorInline = inputfield =>
  !!inputfield.querySelector('.InputfieldCKEditorInline');

/**
 * Handles translations for CKEditor Inputfields
 * @return {object}  Public methods
 */
const FtInputfieldCKEditorInline = function (inputfield) {
  /**
   * Contains values for all fields/languages
   * Populated on FtInputfieldCKEditorInline instantiation
   * @property {String} ProcessWire Language ID
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
   * Will contain all elements that the inline editor uses for content
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */
  const contentElements = {};

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
   * Attempts to get the value for a language via the CKEditor API, falls back to directly getting
   * the content of the content element
   * @access public
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */
  this.getValueForLanguage = languageId => {
    const ckeditorInstance = this.getEditorInstanceForLanguage(languageId);

    if (ckeditorInstance) {
      return ckeditorInstance.getData();
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
    const instance = this.getEditorInstanceForLanguage(languageId);
    const contentElement = this.getContentElementForLanguage(languageId);

    instance ? instance.setValue(value) : (contentElement.innerHTML = value);

    contentElement.dispatchEvent(new Event('input'));

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

    editorInstances[languageId] = CKEDITOR.instances[this.createCKEditorSelector(languageId)];

    return editorInstances[languageId];
  };

  /**
   * Gets the content element that CKEditor uses to store the field content
   * Ensures memoization
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */
  this.getContentElementForLanguage = languageId => {
    if (Object.hasOwn(contentElements, languageId)) {
      return contentElements[languageId];
    }

    contentElements[languageId] = this.getInputContainerForLanguage(languageId).querySelector(
      '.InputfieldCKEditorInlineEditor'
    );

    return contentElements[languageId];
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
    if (Object.keys(inputContainers).length === FtConfig.getLanguageCount()) {
      return inputContainers;
    }

    this.getSelf()
      .querySelectorAll('[data-language]')
      .forEach(el => {
        inputContainers[el.dataset.language] = el;
      });

    return inputContainers;
  };

  /**
   * Gets a specific input container
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */
  this.getInputContainerForLanguage = languageId => {
    if (Object.hasOwn(inputContainers, languageId)) {
      return inputContainers[languageId];
    }

    inputContainers[languageId] = inputfield.querySelector(`[data-language="${languageId}"]`);

    return inputContainers[languageId];
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
   * Creates a MutationObserver that will detect when the content has changed for a given content
   * element. When content is changed, is will mock an 'input' even that an eventListener will
   * respond to
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
   * Registers an event listener that will respond to any 'input' changes in a
   * content element
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
   * Init on object instantiation
   * @access private
   * @return {Void}
   */
  (() => {
    if (CKEDITOR === undefined) {
      console.error('CKEditor was not found by Fluency, translation unavailable');

      return null;
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

export { FtIsInputfieldCKEditorInline, FtInputfieldCKEditorInline };
