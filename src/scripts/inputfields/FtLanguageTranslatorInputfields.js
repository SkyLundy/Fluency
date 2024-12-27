import FtActivityOverlay from '../ui/FtActivityOverlay';
import FtUiElements from '../ui/FtUiElements';
import FtConfig from '../global/FtConfig';
import Fluency from '../global/Fluency';

/**
 * Used for creating translation function for ProcessWire's core language translation pages
 *
 * @return {Object} Public methods
 */
const FtLanguageTranslatorInputfields = (function () {
  /**
   * Initialize
   * @return {void}
   */
  const init = () => {
    initFields();
    initTranslateAllButton();
  };

  /**
   * Initializes per-field translation triggers
   * @return {void}
   */
  const initFields = () => {
    const translationInputfields = document.querySelectorAll('.InputfieldContent');

    if (!translationInputfields) {
      return;
    }

    [...translationInputfields].forEach(inputfield => {
      if (inputfield.querySelector('input.translatable, textarea.translatable')) {
        new LanguageTranslatorInputfield(inputfield);
      }
    });
  };

  const initTranslateAllButton = () => {
    const container = document.querySelector('.Inputfields');

    new AllInputfieldTranslator(container);
  };

  return {
    init,
  };
})();

/**
 * Creates and binds the translate all button
 */
const AllInputfieldTranslator = function (inputfields) {
  let activityOverlay;

  let sourceTargetMap = [];

  let sourceLanguageSelect = null;

  this.getSelf = () => inputfields;

  this.getActivityOverlay = () => activityOverlay;

  this.addLanguageTranslatorInputs = () => {
    const { translateAllButton, sourceLanguageSelect, container } =
      FtUiElements.createLanguageTranslatorInputs();

    this.sourceLanguageSelect = sourceLanguageSelect;

    this.bindSourceLanguageSelect(sourceLanguageSelect);
    this.bindTranslateButton(translateAllButton);

    document.querySelector('.Inputfields').insertAdjacentElement('afterbegin', container);
  };

  /**
   * Bind the behavior that removes the state changed class that alerts the user of unsaved changes
   */
  this.bindSourceLanguageSelect = select => {
    select.addEventListener('change', e => {
      setTimeout(() => {
        e.target.closest('.InputfieldStateChanged')?.classList.remove('InputfieldStateChanged');
      }, 100);
    });
  };

  this.bindTranslateButton = button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      this.translateContent();
    });
  };

  /**
   * This chunks the sourceTargetElement array into an array of smaller arrays that can be
   * handled by the translation service
   * @return {array} Array of arrays containing content/inputs
   */
  this.getGroupedContentForTranslation = () => {
    const perChunk = 40; // groups per chunk

    return sourceTargetMap.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = []; // start a new chunk
      }

      chunks[chunkIndex].push(item);

      return chunks;
    }, []);
  };

  /**
   * Translates all fields in chunks
   * @return {void}
   */
  this.translateContent = () => {
    const translationGroups = this.getGroupedContentForTranslation();

    activityOverlay.showActivity();

    let groupsToTranslate = translationGroups.length;

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('language_id'));

    let errorOccurred = false;

    const sourceLangageCode = this.sourceLanguageSelect.value;

    translationGroups.forEach((translationGroup, i) => {
      // Stop trying if something went wrong
      if (errorOccurred) {
        return;
      }

      Fluency.getTranslation(
        sourceLangageCode,
        FtConfig.getLanguageForId(id).engineLanguage.targetCode,
        translationGroup.map(sourceTarget => sourceTarget.text),
      )
        .then(result => {
          // Handle an error
          if (result.error) {
            if (!errorOccurred) {
              activityOverlay.showError(result.message);

              errorOccurred = true;
            }

            return;
          }

          const translations = result.translations;

          if (translationGroup.length !== translations.length) {
            activityOverlay.showError('Error');

            errorOccurred = true;

            return;
          }

          for (let i = 0; i < translations.length; i++) {
            translationGroup[i].input.value = translations[i];
          }
        })
        .then(result => {
          groupsToTranslate--;

          if (groupsToTranslate === 0 && !errorOccurred) {
            activityOverlay.hide();
          }
        });
    });
  };

  /**
   * Push all source text and target inputs to array that can be translated in bulk
   * @return {void}
   */
  this.mapSourceTargetElements = () => {
    [...document.querySelectorAll('.InputfieldContent')].forEach(inputfield => {
      const description = inputfield.querySelector('.description');
      const targetInput = inputfield.querySelector('input.translatable, textarea.translatable');

      if (targetInput && description && description.innerText) {
        sourceTargetMap.push({ text: description.innerText, input: targetInput });
      }
    });
  };

  (() => {
    activityOverlay = new FtActivityOverlay(this);

    this.mapSourceTargetElements();

    this.addLanguageTranslatorInputs();
  })();
};

const LanguageTranslatorInputfield = function (inputfieldContainer) {
  /**
   * Gets all localized strings from the FluencyConfig object
   * These do nothing on their own and must be bound with any behavior after creation
   *
   * @type {object}
   */
  const uiText = FtConfig.getUiTextFor('inputfieldTranslateButtons');

  let activityOverlay;

  let sourceText = inputfieldContainer.querySelector('.description').innerText;

  let targetInput = inputfieldContainer.querySelector('input, textarea');

  this.getSelf = () => inputfieldContainer;

  this.getActivityOverlay = () => activityOverlay;

  this.addLanguageTranslatorInputs = () => {
    const { button, container } = FtUiElements.createTranslateButton(uiText.translate);

    this.bindTranslateButton(button);

    inputfieldContainer.appendChild(container);
  };

  this.bindTranslateButton = button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      this.translateContent();
    });
  };

  /**
   * Gets the selected language code from the source language select field
   */
  this.getSourceLanguageCode = () => {
    const elClasses = FtConfig.getElementClassesFor('languageTranslator').sourceLanguageSelect;

    return document.querySelector(`.${elClasses.split(' ').join('.')}`).value;
  };

  this.translateContent = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('language_id'));

    activityOverlay.showActivity();

    Fluency.getTranslation(
      this.getSourceLanguageCode(),
      FtConfig.getLanguageForId(id).engineLanguage.targetCode,
      sourceText,
    ).then(result => {
      if (result.error) {
        activityOverlay.showError(result.message);

        return;
      }

      targetInput.value = result.translations[0];

      activityOverlay.hide();
    });
  };

  (() => {
    activityOverlay = new FtActivityOverlay(this);

    this.addLanguageTranslatorInputs();
  })();
};

export default FtLanguageTranslatorInputfields;
