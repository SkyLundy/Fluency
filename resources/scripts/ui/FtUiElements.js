import FtConfig from '../global/FtConfig';
import Fluency from '../global/Fluency';

/**
 * Creates common HTML elements
 *
 * @return {Object} Public methods
 */
const FtUiElements = (function () {
  /**
   * @type {Object}
   */
  const elementClasses = FtConfig.elementClasses;

  /**
   * Gets all localized strings from the FluencyConfig object
   * These do nothing on their own and must be bound with any behavior after creation
   * @type {object}
   */
  const uiText = FtConfig.getUiTextFor('inputfieldTranslateButtons');

  /**
   * Creates a language fontawesome icon element
   * @return {Element}
   */
  const createIcon = () => {
    const iconLink = document.createElement('a');
    iconLink.setAttribute('href', `${ProcessWire.config.urls.admin}fluency/?modal=1`);
    iconLink.setAttribute('class', 'pw-modal pw-modal-large');

    const icon = document.createElement('i');
    icon.setAttribute('class', `${FtConfig.getElementClassesFor('icon')} fa fa-language`);
    icon.setAttribute('uk-tooltip', uiText.showTranslator);

    iconLink.appendChild(icon);

    return iconLink;
  };

  /**
   * Creates a status placeholder
   * @param  {string} text Button text
   * @return {Element}
   */
  const createStatusElement = text => {
    const elClasses = FtConfig.getElementClassesFor('statusPlaceholder');

    const label = document.createElement('span');
    label.setAttribute('class', elClasses.label);
    label.innerText = text;

    const container = document.createElement('div');
    container.setAttribute('class', elClasses.container);

    container.appendChild(createIcon());
    container.appendChild(label);

    return container;
  };

  /**
   * Creates a translate button element
   * @return {Object} Container element and Button element
   */
  const createTranslateButton = text => {
    const elClasses = FtConfig.getElementClassesFor('translateButton');

    const button = document.createElement('a');
    button.innerText = text;
    button.setAttribute('class', elClasses.button);
    button.setAttribute('href', '');

    const container = document.createElement('div');
    container.setAttribute('class', elClasses.container);

    container.appendChild(createIcon());
    container.appendChild(button);

    return {
      button,
      container,
    };
  };

  /**
   * Creates the translate to all for the language translator pages
   * @param  {string} text Button label
   * @return {Element}
   */
  const createLanguageTranslatorInputs = () => {
    const elClasses = FtConfig.getElementClassesFor('languageTranslator');
    const texts = FtConfig.getUiTextFor('languageTranslator');

    // Translate All button
    const translateAllButton = document.createElement('a');
    translateAllButton.innerText = texts.translateAllButton;
    translateAllButton.setAttribute('class', elClasses.translateButton);
    translateAllButton.setAttribute('href', '');

    // Source language select
    const sourceLanguageSelect = document.createElement('select');
    sourceLanguageSelect.setAttribute('class', elClasses.sourceLanguageSelect);

    // Source language select options
    FtConfig.getConfiguredLanguages().forEach(function (language) {
      const option = document.createElement('option');
      option.textContent = language.title;
      option.value = language.engineLanguage.sourceCode;

      if (language.default) {
        option.selected = 'selected';
        sourceLanguageSelect.prepend(option);

        return;
      }

      sourceLanguageSelect.appendChild(option);
    });

    // Source language select label text
    const selectLabelText = document.createElement('span');
    selectLabelText.innerText = texts.sourceLanguageSelectLabel;

    // Source language select label
    const sourceLanguageSelectLabel = document.createElement('label');
    sourceLanguageSelectLabel.setAttribute('class', elClasses.sourceLanguageSelectLabel);
    sourceLanguageSelectLabel.appendChild(selectLabelText);
    sourceLanguageSelectLabel.appendChild(sourceLanguageSelect);

    // Container that holds all UI elements
    const content = document.createElement('div');
    content.setAttribute('class', elClasses.content);
    content.appendChild(translateAllButton);
    content.appendChild(sourceLanguageSelectLabel);

    // ProcessWire UI fields container
    const container = document.createElement('li');
    container.setAttribute('class', elClasses.container);
    container.appendChild(content);

    return {
      translateAllButton,
      sourceLanguageSelect,
      container,
    };
  };

  return {
    createStatusElement,
    createTranslateButton,
    createLanguageTranslatorInputs,
    createIcon,
    elementClasses,
  };
})();

export default FtUiElements;
