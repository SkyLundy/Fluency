import FtConfig from '../global/FtConfig';
import FtTools from '../global/FtTools';
import Fluency from '../global/Fluency';
import FtUiElements from './FtUiElements';

/**
 * The translate button establishes the UI element used to trigger translations
 * by the user. It manages the translation process by displaying/hiding the
 * activity overlay, showing messages and errors, getting translations from
 * the Fluency API, and modifying content. This is done by manipulating the
 * inputfield and activityOverlay objects passed.
 */

const FtInputfieldTranslateButton = function (inputfield, inputContainers) {
  /**
   * Gets all localized strings from the FluencyConfig object
   * @type {object}
   */
  const uiText = FtConfig.getUiTextFor('inputfieldTranslateButtons');

  /**
   * Add
   * @param  {string|int} languageId     ProcessWire language ID
   * @param  {Element}    inputContainer Inputcontainer for this language
   * @return {void}
   */
  this.addTranslateElements = (languageId, inputContainer) => {
    const isTranslatable = FtConfig.languageIsTranslatable(languageId);
    const isDefaultLanguage = languageId == FtConfig.getDefaultLanguage().id;

    // Translatable, not default language
    if (isTranslatable && !isDefaultLanguage) {
      const { button, container } = FtUiElements.createTranslateButton(uiText.translateButton);

      this.bindButton(button, FtConfig.getLanguageForId(languageId));

      inputContainer.appendChild(container);
    }

    // Translatable, default language
    if (isTranslatable && isDefaultLanguage) {
      inputContainer.appendChild(FtUiElements.createStatusElement(uiText.translationAvailable));
    }

    // Not translatable
    if (!isTranslatable) {
      inputContainer.appendChild(FtUiElements.createStatusElement(uiText.languageNotAvailable));
    }
  };

  /**
   * Binds a button for translation
   * @param  {Element} buttonElement Element to bind translation action to
   * @param  {Object} languageConfig Fluency language configuration object
   * @return {Void}
   */
  this.bindButton = (buttonElement, languageConfig) => {
    buttonElement.addEventListener('click', e => {
      e.preventDefault();

      // Try to get the inputfield activity overlay, fall back to retrieving by language ID where
      // the inputfield element can delegate to a specific activity overlay located within it
      const activityOverlay =
        inputfield.getActivityOverlay() ?? inputfield.getActivityOverlay(languageConfig.id);

      activityOverlay.showActivity();

      Fluency.getTranslation(
        FtConfig.getDefaultLanguage().engineLanguage.sourceCode,
        languageConfig.engineLanguage.targetCode,
        inputfield.getValueForDefaultLanguage(),
      ).then(result => {
        if (result.error) {
          inputfield.getActivityOverlay().showError(result.message);

          return;
        }

        inputfield.setValueForLanguage(languageConfig.id, result.translations[0]);

        activityOverlay.hide();
      });
    });
  };

  /**
   * Init on object instantiation
   */
  (() => {
    for (let languageId in inputContainers) {
      this.addTranslateElements(languageId, inputContainers[languageId]);
    }
  })();
};

export default FtInputfieldTranslateButton;
