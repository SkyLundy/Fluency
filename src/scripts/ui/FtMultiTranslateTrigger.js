/**
 * Multi-Language Trigger
 * Allow disabling translate-to-all
 */

import FtConfig from '../global/FtConfig';
import FtTools from '../global/FtTools';

/**
 * Trigger style: Translate [from/to] [language list/all]
 * Default Language: default Translate [to] [select language]
 * - [select language] has [All] option
 *
 * Other language default Translate [from] [default language]
 */

const FtTranslateTrigger = function (inputfield, activityOverlay) {
  /**
   * Will hold translate trigger for this inputfield
   * @type {Element}
   */
  // let trigger;

  const translateFormClass = 'ft-translate-form';

  const translateFormFieldNames = {
    direction: 'direction',
    thisLanguageId: 'this_language_id',
    selectLanguageId: 'selected_language_id',
  };

  /**
   * Gets all localized strings from the FluencyConfig object
   * @type {object}
   */
  const strings = FtConfig.getUiTextFor('translateTrigger');

  /**
   * Initializes the translate trigger for a given field
   * @param  {object} languageConfig Language object from FtConfig languages
   * @return {void}
   */
  this.initTrigger = languageConfig => {
    // Get container for each language
    //
    const trigger = this.buildTrigger(languageConfig);

    this.bindTrigger(languageConfig, trigger);
    this.insertTrigger(languageConfig, trigger);
  };

  this.buildTrigger = languageConfig => {
    const form = document.createElement('form');

    form.setAttribute('class', translateFormClass);

    // Create ID for label
    directionSelectId = FtTools.createRandomString(5);

    const directionSelectLabel = document.createElement('label');
    directionSelectLabel.setAttribute('for', directionSelectId);
    directionSelectLabel.text = strings.translationDirection;

    const directionSelect = document.createElement('select');
    directionSelect.id = directionSelectId;
    select.name = translateFormFieldNames.translationDirection;

    const toOption = document.createElement('option');
    toOption.value = 'to';
    toOption.text = strings.translateTo;

    const fromOption = document.createElement('option');
    fromOption.value = 'from';
    fromOption.text = strings.translateFrom;

    // If this is the default, assume you want to translate TO another language
    if (languageConfig.default) {
      directionSelect.add(toOption);
      directionSelect.add(fromOption);
    }

    // If this not the default, assume you want to translate FROM another language
    if (languageConfig.default) {
      directionSelect.add(fromOption);
      directionSelect.add(toOption);
    }

    form.appendChild(directionSelect);

    const languageSelect = document.createElement('select');

    const thisLanguageId = document.create('input');
    thisLanguageId.type = 'hidden';
    thisLanguageId.value = languageConfig.id;

    form.appendChild(thisLanguageId);

    const translateButton = document.createButton('submit');
    translateButton.value('translate');
    translateButton.style.border = '5px solid red';

    form.appendChild(translateButton);

    return form;
  };

  this.bindTrigger = (languageConfig, trigger) => {
    // Get container, bind button to
  };

  this.insertTrigger = (languageConfig, trigger) => {
    const inputContainer = inputfield.getInputContainerForLanguage(languageConfig.id);

    inputContainer.appendChild(trigger);

    // Insert trigger in container,
    // inputfield.appendChild(node: Node)
  };

  this.translateFrom = (sourceId, targetId) => {};

  this.translateTo = (sourceId, targetId) => {
    // Each
    // Translate
  };

  this.translateToAll = sourceId => {
    // Loop through languages, get translation for each, insert into field by ID
    // Show overlay that updates each language indicator as the translations come through
  };

  (() => {
    const languages = FtConfig.getAllLanguages();

    for (let language of languages) {
      this.initTrigger();
    }
  })();
};
