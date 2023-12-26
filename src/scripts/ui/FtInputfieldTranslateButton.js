import FtConfig from '../global/FtConfig';
import Fluency from '../global/Fluency';
import FtUiElements from './FtUiElements';

/**
 * The translate button establishes the UI element used to trigger translations
 * by the user. It manages the translation process by displaying/hiding the
 * activity overlay, showing messages and errors, getting translations from
 * the Fluency API, and modifying content. This is done by manipulating the
 * inputfield and activityOverlay objects passed.
 */

/**
 * @param {Element}  inputfield
 * @param {NodeList}  inputContainers
 * @param {Boolean} forceEachTranslationAction Force a single field translation trigger
 */
const FtInputfieldTranslateButton = function (
  inputfield,
  inputContainers,
  forceEachTranslationAction = false,
) {
  /**
   * Gets all localized strings from the FluencyConfig object
   * @type {object}
   */
  const uiText = FtConfig.getUiTextFor('inputfieldTranslateButtons');

  /**
   * Adds translate elements to inputfield containers
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

      const translationSourceContent = inputfield.getValueForDefaultLanguage();

      if (!translationSourceContent) {
        return;
      }

      // Try to get the inputfield activity overlay, fall back to retrieving by language ID where
      // the inputfield element can delegate to a specific activity overlay located within it
      const activityOverlay =
        inputfield.getActivityOverlay() ?? inputfield.getActivityOverlay(languageConfig.id);

      activityOverlay.showActivity();

      Fluency.getTranslation(
        FtConfig.getDefaultLanguage().engineLanguage.sourceCode,
        languageConfig.engineLanguage.targetCode,
        translationSourceContent,
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
   * Creates the "Translate to all" button and adds it to the inputfield
   *
   * @param  {int}          sourceLanguageId     ProcessWire language ID
   * @param  {HTMLElements} inputContainers      All language input containers for this inputfield
   * @return {void}
   */
  this.addTranslateToAllButton = (sourceLanguageId, inputContainers) => {
    const sourceInputContainer = inputContainers[sourceLanguageId];

    const { button, container } = FtUiElements.createTranslateButton(uiText.translateToAllButton);

    this.bindTranslateToAllButton(
      button,
      FtConfig.getLanguageForId(sourceLanguageId),
      inputContainers,
    );

    sourceInputContainer.appendChild(container);
  };

  /**
   * Binds translation action to button that translates to all other languages
   *
   * @param  {Element}  buttonElement        [description]
   * @param  {object}   sourceLanguageConfig The FtConfig object for the source language
   * @param  {HTMLElements} inputContainers      All language input containers for this inputfield
   * @return {void}
   */
  this.bindTranslateToAllButton = (buttonElement, sourceLanguageConfig, inputContainers) => {
    buttonElement.addEventListener('click', e => {
      e.preventDefault();

      const translationSourceContent = inputfield.getValueForLanguage(sourceLanguageConfig.id);

      // Do not translate if there's no source content or risk content in other languages to
      // be removed
      if (!translationSourceContent) {
        return;
      }

      // Used to count the number of languages left when translating to all
      // Subtract 1 to account for default language which will not be translated
      let translationLanguageCount = Object.keys(inputContainers).length - 1;

      let errorOccurred = false;

      let activityOverlay = inputfield.getActivityOverlay();

      activityOverlay.showActivity();

      for (let targetLanguageId in inputContainers) {
        targetLanguageId = parseInt(targetLanguageId, 10);

        // No need to translate source
        if (targetLanguageId === sourceLanguageConfig.id) {
          continue;
        }

        let targetLanguageConfig = FtConfig.getLanguageForId(targetLanguageId);

        Fluency.getTranslation(
          sourceLanguageConfig.engineLanguage.sourceCode,
          targetLanguageConfig.engineLanguage.targetCode,
          translationSourceContent,
        )
          .then(result => {
            if (result.error) {
              // Only show the error overlay if an error has not already occurred
              if (!errorOccurred) {
                inputfield.getActivityOverlay().showError(result.message);
              }

              errorOccurred = true;

              return;
            }

            inputfield.setValueForLanguage(targetLanguageConfig.id, result.translations[0]);
          })
          .then(result => {
            translationLanguageCount--;

            // If an error occurred, messaging/overlay will be handled by the error process
            if (translationLanguageCount === 0 && !errorOccurred) {
              activityOverlay.hide();
            }
          });
      }
    });
  };

  this.addBothTranslationButtonTypes = (languageId, inputContainers) => {
    this.addTranslateToAllButton(languageId, inputContainers);
    this.addTranslateElements(languageId, inputContainers[languageId]);
  };

  /**
   * Init on object instantiation
   */
  (() => {
    const actionTypes = FtConfig.translationActionTypes;
    const translationAction = FtConfig.getTranslationAction();

    for (let languageId in inputContainers) {
      if (translationAction === actionTypes.all && !forceEachTranslationAction) {
        this.addTranslateToAllButton(languageId, inputContainers);
      }

      if (translationAction === actionTypes.each || forceEachTranslationAction) {
        this.addTranslateElements(languageId, inputContainers[languageId]);
      }

      if (translationAction === actionTypes.both && !forceEachTranslationAction) {
        this.addBothTranslationButtonTypes(languageId, inputContainers);
      }
    }
  })();
};

export default FtInputfieldTranslateButton;
