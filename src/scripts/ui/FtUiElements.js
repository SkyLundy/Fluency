import FtConfig from '../global/FtConfig';
import FtTools from '../global/FtTools';
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
   *
   * @type {object}
   */
  const uiText = FtConfig.getUiTextFor('inputfieldTranslateButtons');

  /**
   * Creates a language fontawesome icon element
   *
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
   *
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
   *
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

  const createTranslateAllButton = text => {
    const elClasses = FtConfig.getElementClassesFor('translateAllButton');

    const button = document.createElement('a');
    button.innerText = FtConfig.getUiTextFor('languageTranslator').translateAllButton;
    button.setAttribute('class', elClasses.button);
    button.setAttribute('href', '');

    const content = document.createElement('div');
    content.setAttribute('class', elClasses.content);
    content.appendChild(button);

    const container = document.createElement('li');
    container.setAttribute('class', elClasses.container);
    container.appendChild(content);

    return {
      button,
      container,
    };
  };

  return {
    createStatusElement,
    createTranslateButton,
    createTranslateAllButton,
    createIcon,
    elementClasses,
  };
})();

export default FtUiElements;
