import Fluency from '../global/Fluency';
import FtConfig from '../global/FtConfig';
import FtActivityOverlay from '../ui/FtActivityOverlay';

const FtStandaloneTranslatorFieldset = (function () {
  /**
   * Attribute added to table after initialization
   * @type {String}
   */
  const initializedAttr = 'data-ft-initialized';

  /**
   * Initialize all fieldsets
   * @return {void}
   */
  const init = () => {
    const translationApiUsageTables = document.querySelectorAll(
      `.ft-standalone-translator:not([${initializedAttr}])`
    );

    [...translationApiUsageTables].forEach(usageTableEl => {
      new initializeStandaloneTranslatorFieldset(usageTableEl);
    });
  };

  return {
    initializedAttr,
    init,
  };
})();

/**
 * Creates all behavior for a given standalone translator
 * @param  {Element} fieldset
 * @return {void}
 */
const initializeStandaloneTranslatorFieldset = function (fieldset) {
  /**
   * Contains the activityOverlay object
   * @type {Object}
   */
  let activityOverlay;

  /**
   * Provides set/get methods for the type of Inputfields present for source/translated content
   */
  let sourceContentController;
  let translatedContentController;

  /**
   * Provides interfaces for language select Inputfields
   */
  let sourceLanguageSelectController;
  let targetLanguageSelectController;

  /**
   * Standalone translator localized text
   *
   * @type {object}
   */
  let uiText = FtConfig.getUiTextFor('standaloneTranslator');

  /**
   * The classes assigned to the fields within the translator
   * Values will be replaced with their corresponding HTML Elements on initialization
   * @type {Object}
   */
  const translatorEls = {
    sourceLanguageSelect: 'ft-source-language',
    targetLanguageSelect: 'ft-target-language',
    sourceContentInputfield: 'ft-source-content',
    translatedContentInputfield: 'ft-translated-content',
    translateButton: 'js-ft-translate',
    copyButton: 'ft-click-to-copy',
  };

  /**
   * Finds the elements corresponding to their classes, or elements derived from
   *
   * @return {void}
   */
  this.cacheInputs = () => {
    translatorEls.translateButton = fieldset.querySelector(`.${translatorEls.translateButton}`);

    translatorEls.sourceLanguageSelect = fieldset
      .querySelector(`.${translatorEls.sourceLanguageSelect}`)
      .closest('li.Inputfield');

    translatorEls.targetLanguageSelect = fieldset
      .querySelector(`.${translatorEls.targetLanguageSelect}`)
      .closest('li.Inputfield');

    translatorEls.sourceContentInputfield = fieldset
      .querySelector(`.${translatorEls.sourceContentInputfield}`)
      .closest('li.Inputfield');

    translatorEls.translatedContentInputfield = fieldset
      .querySelector(`.${translatorEls.translatedContentInputfield}`)
      .closest('li.Inputfield');
  };

  /**
   * Returns this inputfield instance
   * @return {Element}
   */
  this.getSelf = () => fieldset;

  /**
   * Binds behavior to translate button
   *
   * @return {void}
   */
  this.bindTranslateButton = () => {
    translatorEls.translateButton.addEventListener('click', e => {
      e.preventDefault();

      let sourceLanguage = sourceLanguageSelectController.getValue();
      let targetLanguage = targetLanguageSelectController.getValue();
      let sourceContent = sourceContentController.getContent();

      if (!sourceLanguage) {
        sourceLanguageSelectController.indicateError();
      }

      if (!targetLanguage) {
        targetLanguageSelectController.indicateError();
      }

      if (!sourceContent) {
        sourceContentController.indicateError();
      }

      if (!sourceLanguage || !targetLanguage || !sourceContent) {
        return;
      }

      activityOverlay.showActivity();

      Fluency.getTranslation(sourceLanguage, targetLanguage, sourceContent).then(result => {
        if (result.error) {
          activityOverlay.showError(result.message);
        }

        translatedContentController.setContent(result.translations[0]);

        activityOverlay.hide();
      });
    });
  };

  /**
   * Adds and binds the copy content button
   * @return {void}
   */
  this.addCopyContentButton = () => {
    const copyButtonClass = translatorEls.copyButton;

    translatorEls.copyButton = document.createElement('button');
    translatorEls.copyButton.setAttribute('class', copyButtonClass);
    translatorEls.copyButton.innerText = uiText.clickToCopy;

    const copyIcon = document.createElement('i');
    copyIcon.setAttribute('class', 'ft-copy-icon fa fa-fw fa-clone');

    translatorEls.copyButton.appendChild(copyIcon);

    const inputfieldHeader =
      translatorEls.translatedContentInputfield.querySelector('.InputfieldHeader');

    inputfieldHeader.classList.add(`${copyButtonClass}-container`);
    inputfieldHeader.appendChild(translatorEls.copyButton);

    this.bindCopyContentButton();
  };

  /**
   * Binds the event listener for the button copy action
   *
   * @return {void}
   */
  this.bindCopyContentButton = () => {
    translatorEls.copyButton.addEventListener('click', e => {
      e.preventDefault();

      const content = translatedContentController.getContent();

      if (content) {
        navigator.clipboard.writeText(content).then(() => {
          translatedContentController.indicateSuccess(uiText.copied);
        });
      }
    });
  };

  /**
   * Shows/hides content copy button
   * @param  {Bool} contentPresent Determines if button is shown or not
   * @return {void}
   */
  this.toggleCopyContentButton = contentPresent => {
    if (contentPresent) {
      translatorEls.copyButton.classList.add('visible');
      return;
    }

    translatorEls.copyButton.classList.remove('visible');
  };

  this.createInputControllers = () => {
    sourceLanguageSelectController = new languageSelectController(
      translatorEls.sourceLanguageSelect
    );

    targetLanguageSelectController = new languageSelectController(
      translatorEls.targetLanguageSelect
    );

    sourceContentController = new translationContentController(
      translatorEls.sourceContentInputfield
    );

    translatedContentController = new translationContentController(
      translatorEls.translatedContentInputfield,
      this.toggleCopyContentButton
    );
  };

  /**
   * Inits on object creation
   */
  (() => {
    this.cacheInputs();
    this.createInputControllers();

    activityOverlay = new FtActivityOverlay(this);

    this.addCopyContentButton();
    this.bindTranslateButton();
  })();
};

/**
 * Stat management for language select Inputfields
 */
const languageSelectController = function (inputfield) {
  let activityOverlay;

  let selectEl;

  this.getSelf = () => inputfield;

  this.getValue = () => selectEl.value;

  this.indicateError = () => activityOverlay.flashError('', 300);

  (() => {
    selectEl = inputfield.querySelector('select');

    activityOverlay = new FtActivityOverlay(this);
  })();
};

/**
 * Content IO for translation content Inputfields
 */
const translationContentController = function (inputfield, contentPresenceChangeCallback = null) {
  /**
   * Standalone translator localized text
   *
   * @type {object}
   */
  let uiText = FtConfig.getUiTextFor('standaloneTranslator');

  /**
   * Holds the textarea that will have content managed
   */
  let inputfieldContent;

  /**
   * Holds state of field contents
   */
  let hasContent = false;

  /**
   * Activity Overlay instance
   */
  let activityOverlay;

  this.getSelf = () => inputfield;

  /**
   * Retrieves content from this Inputfield
   * @return {String}
   */
  this.getContent = () => inputfieldContent.get();

  /**
   * Sets content for this Inputfield
   * @param  {String} content Content to set
   * @return {void}
   */
  this.setContent = content => {
    inputfieldContent.set(content);
  };
  // this.setContent = content => inputfieldContent.set(content);

  /**
   * Flash an error overlay to draw attention
   * @return {void}
   */
  this.indicateError = () => activityOverlay.flashError('', 300);

  /**
   * Flash a success message overlay
   * @param  {String} message Content of message
   * @return {void}
   */
  this.indicateSuccess = message => activityOverlay.flashSuccess(message);

  /**
   * Inits on object creation
   */
  (() => {
    inputfieldContent = new textareaInputfieldContent(inputfield, contentPresenceChangeCallback);
    activityOverlay = new FtActivityOverlay(this);
  })();
};

/**
 * textarea I/O
 */
const textareaInputfieldContent = function (inputfield, stateChangeCallback = null) {
  let textarea;

  let hasContent = false;

  this.set = content => {
    textarea.value = content;

    textarea.dispatchEvent(new Event('input'));
  };

  this.get = () => textarea.value;

  this.bindContentChangeListener = () => {
    textarea.addEventListener('input', e => {
      const currentContent = e.target.value;

      if (currentContent && !hasContent) {
        hasContent = true;

        stateChangeCallback(true);
      }

      if (!currentContent && hasContent) {
        hasContent = false;

        stateChangeCallback(false);
      }
    });
  };

  (() => {
    textarea = inputfield.querySelector('textarea');

    if (stateChangeCallback) {
      this.bindContentChangeListener();
    }
  })();
};

export default FtStandaloneTranslatorFieldset;
