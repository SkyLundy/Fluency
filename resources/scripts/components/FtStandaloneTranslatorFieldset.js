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
    const standaloneTranslatorFieldsets = document.querySelectorAll(
      `.ft-standalone-translator-fieldset:not([${initializedAttr}])`,
    );

    [...standaloneTranslatorFieldsets].forEach(translatorFieldset => {
      new standaloneTranslatorFieldset(translatorFieldset);
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
const standaloneTranslatorFieldset = function (fieldset) {
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
    clearButton: 'ft-click-to-clear',
    swapButton: 'js-ft-swap-languages',
  };

  /**
   * Finds the elements corresponding to their classes, or elements derived from
   *
   * @return {void}
   */
  this.cacheElements = () => {
    translatorEls.translateButton = fieldset.querySelector(`.${translatorEls.translateButton}`);
    translatorEls.swapButton = document.querySelector(`.${translatorEls.swapButton}`);

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

      const sourceLanguage = sourceLanguageSelectController.getValue();
      const targetLanguage = targetLanguageSelectController.getValue();
      const sourceContent = sourceContentController.getContent();

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
   * Holds the currently selected languages for swapping
   * @type {Object}
   */
  this.selectedLanguages = {
    source: null,
    target: null,
  };

  /**
   * Binds behavior to language swap button
   *
   * @return {void}
   */
  this.bindLanguageSwapButton = () => {
    translatorEls.swapButton.addEventListener('click', e => {
      e.preventDefault();

      this.swapLanguageSelectValues();
      this.swapTranslationContent();
    });
  };

  /**
   * Swaps the contents of the original/translated fields
   * @return {void}
   */
  this.swapTranslationContent = () => {
    const sourceContent = sourceContentController.getContent();
    const targetContent = translatedContentController.getContent();

    sourceContentController.setContent(targetContent);
    translatedContentController.setContent(sourceContent);
  };

  /**
   * Swaps the source/target language select values
   * @return {[type]}
   */
  this.swapLanguageSelectValues = () => {
    let sourceLanguage = this.selectedLanguages.source;
    let targetLanguage = this.selectedLanguages.target;

    const sourceOptions = sourceLanguageSelectController.getOptions();
    const targetOptions = targetLanguageSelectController.getOptions();

    const newSourceLanguage = this.getLanguageSwapValue('target', sourceOptions);
    const newTargetLanguage = this.getLanguageSwapValue('source', targetOptions);

    sourceLanguageSelectController.setValue(newSourceLanguage);
    targetLanguageSelectController.setValue(newTargetLanguage);

    this.selectedLanguages.source = targetLanguage;
    this.selectedLanguages.target = sourceLanguage;
  };

  /**
   * Find a language if it exists in a given language select options array
   * If it is not found with a direct match, converts the value of language to a simplified language
   * code and returns a potential match
   *
   * @param  {String} type   Language select value
   * @param  {Array} options Language select option values
   * @return {String|null}   Language code if found, null if doesn't exist
   */
  this.getLanguageSwapValue = (type, options) => {
    let language = this.selectedLanguages[type];

    if (options.includes(language)) {
      return language;
    }

    const simplifiedLanguage = language.split('-')[0];
    const simplifiedOptions = options.map(opt => opt.split('-')[0]);
    const simplifiedIndex = simplifiedOptions.indexOf(simplifiedLanguage);

    if (simplifiedIndex) {
      return options[simplifiedIndex];
    }
  };

  /**
   * Sets the initial swap button state on instantiation
   *
   * @return {void}
   */
  this.initLanguageSwapButtonState = () => {
    const sourceLanguage = sourceLanguageSelectController.getValue();
    const targetLanguage = targetLanguageSelectController.getValue();

    this.selectedLanguages.source = sourceLanguage;
    this.selectedLanguages.target = targetLanguage;

    if (!sourceLanguage || !targetLanguage) {
      this.setSwapButtonState.disabled();

      return;
    }

    this.setSwapButtonState.enabled();
  };

  /**
   * Sets enabled/disabled for swap button
   * @type {Object}
   */
  this.setSwapButtonState = {
    enabled: () => (translatorEls.swapButton.disabled = false),
    disabled: () => (translatorEls.swapButton.disabled = true),
  };

  /**
   * Adds the clear content button to the original textarea
   * @return {void}
   */
  this.addClearContentButton = () => {
    const buttonClass = translatorEls.clearButton;

    translatorEls.clearButton = document.createElement('a');
    translatorEls.clearButton.setAttribute('class', buttonClass);

    const clearIcon = document.createElement('i');
    clearIcon.setAttribute('class', 'ft-clear-icon fa fa-fw fa-trash-o');

    const clearText = document.createElement('span');
    clearText.innerText = uiText.clickToClear;
    clearText.setAttribute('class', 'ft-clear-text');

    translatorEls.clearButton.append(clearText, clearIcon);

    const inputfieldHeader =
      translatorEls.sourceContentInputfield.querySelector('.InputfieldHeader');

    inputfieldHeader.classList.add(`${buttonClass}-container`);
    inputfieldHeader.appendChild(translatorEls.clearButton);

    this.bindClearContentButton();
  };

  /**
   * Binds the event listener for the button copy action
   * @return {void}
   */
  this.bindClearContentButton = () => {
    translatorEls.clearButton.addEventListener('click', e => {
      e.preventDefault();

      sourceContentController.clearContent();
      translatedContentController.clearContent();
    });
  };

  /**
   * Adds and binds the copy content button
   * @return {void}
   */
  this.addCopyContentButton = () => {
    const buttonClass = translatorEls.copyButton;

    translatorEls.copyButton = document.createElement('a');
    translatorEls.copyButton.setAttribute('class', buttonClass);

    const copyIcon = document.createElement('i');
    copyIcon.setAttribute('class', 'ft-copy-icon fa fa-fw fa-clone');

    const copyText = document.createElement('span');
    copyText.innerText = uiText.clickToCopy;
    copyText.setAttribute('class', 'ft-copy-text');

    translatorEls.copyButton.append(copyText, copyIcon);

    const inputfieldHeader =
      translatorEls.translatedContentInputfield.querySelector('.InputfieldHeader');

    inputfieldHeader.classList.add(`${buttonClass}-container`);
    inputfieldHeader.appendChild(translatorEls.copyButton);

    this.bindCopyContentButton();
  };

  /**
   * Binds the event listener for the button copy action
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
      translatorEls.copyButton.classList.add('enabled');
      return;
    }

    translatorEls.copyButton.classList.remove('enabled');
  };

  this.createInputControllers = () => {
    sourceLanguageSelectController = new languageSelectController(
      'source',
      translatorEls.sourceLanguageSelect,
      this.languageSelectCallback,
    );

    targetLanguageSelectController = new languageSelectController(
      'target',
      translatorEls.targetLanguageSelect,
      this.languageSelectCallback,
    );

    sourceContentController = new translationContentController(
      translatorEls.sourceContentInputfield,
    );

    translatedContentController = new translationContentController(
      translatorEls.translatedContentInputfield,
      this.toggleCopyContentButton,
    );
  };

  /**
   * Passed to the languageSelectController on creation, is called when 'change' event fires
   *
   * @param  {Object}  selectEl Instance of the calling languageSelectController
   * @param  {Event  } event    addEventListener event object
   * @return {void}
   */
  this.languageSelectCallback = (languageSelectController, event) => {
    const selectType = languageSelectController.getType();
    const value = languageSelectController.getValue();

    this.selectedLanguages[selectType] = value || null;

    !!value ? this.setSwapButtonState.enabled() : this.setSwapButtonState.disabled();
  };

  /**
   * Inits on object creation
   */
  (() => {
    this.cacheElements();
    this.createInputControllers();

    activityOverlay = new FtActivityOverlay(this);

    this.addCopyContentButton();
    this.addClearContentButton();
    this.bindTranslateButton();
    this.initLanguageSwapButtonState();
    this.bindLanguageSwapButton();
  })();
};

/**
 * Stat management for language select Inputfields
 */
const languageSelectController = function (type, inputfield, onChangeCallback) {
  let activityOverlay;

  let selectEl;

  this.getType = () => type;

  this.getSelf = () => inputfield;

  this.getValue = () => selectEl.value || '';

  this.setValue = value => (selectEl.value = value);

  this.getOptions = () => [...selectEl.options].map(opt => opt.value).filter(opt => !!opt);

  this.indicateError = () => activityOverlay.flashError('', 300);

  (() => {
    selectEl = inputfield.querySelector('select');

    selectEl.addEventListener('change', e => onChangeCallback(this, e));

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
  this.setContent = content => inputfieldContent.set(content);

  /**
   * Removes all content from this Inputfield
   * @return {void}
   */
  this.clearContent = () => this.setContent('');

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
