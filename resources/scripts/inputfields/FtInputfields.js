import FtConfig from '../global/FtConfig';
import { FtIsInputfieldCKEditor, FtInputfieldCKEditor } from './FtInputfieldCKEditor';
import {
  FtIsInputfieldCKEditorInline,
  FtInputfieldCKEditorInline,
} from './FtInputfieldCKEditorInline';
import { FtIsInputfieldTable } from './FtInputfieldTable';
import { FtIsInputfieldText, FtInputfieldText } from './FtInputfieldText';
import { FtIsInputfieldTextarea, FtInputfieldTextarea } from './FtInputfieldTextarea';
import { FtIsInputfieldTinyMCE, FtInputfieldTinyMCE } from './FtInputfieldTinyMCE';
import {
  FtIsInputfieldTinyMCEInline,
  FtInputfieldTinyMCEInline,
} from './FtInputfieldTinyMCEInline';
import FtInputfieldPageName from './FtInputfieldPageName';

/**
 * Orchestration for initializing all multilanguage inputfields on a page
 * @return {Object}   Public interface methods
 */
const FtInputfields = (function () {
  /**
   * Selector used to find translatable Inputfields
   * All inputfield containers on the page that are multilanguage have this class
   * @type {String}
   */
  const langInputfieldClass = "[class*='hasLangTabs']";

  /**
   * Attribute present where per-field translation is disabled
   * @type {String}
   */
  const disableTranslationAttr = FtConfig.getTranslationDisabledFieldAttribute();

  /**
   * Initializes multilanguage fields if present on page
   * @return {void}
   */
  const init = function () {
    const langInputfieldContainers = document.querySelectorAll(langInputfieldClass);

    // Only init if there are multi-language Inputfields on the page
    if (langInputfieldContainers.length) {
      initInputfields(langInputfieldContainers);
      initInputfieldsOnInsertion();
      initPageNameInputfields();
    }
  };

  /**
   * Initializes multiple multilanguage fields in a collection of elelents
   * @param  {NodeList} langInputfieldContainers
   * @return {Void}
   */
  const initInputfields = langInputfieldContainers => {
    for (let langInputfieldContainer of langInputfieldContainers) {
      if (translationIsDisabled(langInputfieldContainer)) {
        continue;
      }

      initInputfield(langInputfieldContainer);
    }
  };

  /**
   * Determines if a provided language inputfield has had Fluency translation disabled
   * @param  {HTMLElement} langInputfieldContainer
   * @return {Bool}
   */
  const translationIsDisabled = langInputfieldContainer =>
    !!langInputfieldContainer.querySelectorAll(disableTranslationAttr).length;

  /**
   * Initializes the field within a container
   * @param  {Element} langInputfieldContainer Element containing inputfield
   * @return {void}
   */
  const initInputfield = langInputfieldContainer => {
    // Do not initialize fields that have already been initialized
    // Do not initialized fields that are a list element and not an Inputfield themselves
    if (
      !fieldIsInitialized(langInputfieldContainer) &&
      !langInputfieldContainer.classList.contains('InputfieldItemList') &&
      !isInputfieldTemplate(langInputfieldContainer)
    ) {
      let inputfield = getFtInputfieldObject(langInputfieldContainer);

      setFieldIsInitialized(langInputfieldContainer);

      if (!inputfield) {
        return;
      }
    }
  };

  /**
   * Detect if Inputfield container is a hidden template element used to dynamically create new
   * Inputfields on demand
   * @param  {Element} langInputfieldContainer
   * @return {Bool}
   */
  const isInputfieldTemplate = langInputfieldContainer =>
    !!langInputfieldContainer.closest("[class*='Template']");

  /**
   * Initializes a FtInputfield object instance by type
   * Order of checks is important Complex fields should be cased higher
   * Fields with lower complexity should be cased last to prevent catching simple elements in
   * complex fields that use simple inputs
   * @param  {Element} langInputfieldContainers
   * @return {?Object}
   */
  const getFtInputfieldObject = langInputfieldContainer => {
    switch (true) {
      case FtIsInputfieldTable(langInputfieldContainer):
        // Initialize all new fields which have a different class than top-level fields
        initInputfields(langInputfieldContainer.querySelectorAll('.langTabs'));
        break;
      case FtIsInputfieldCKEditor(langInputfieldContainer):
        return new FtInputfieldCKEditor(langInputfieldContainer);

      case FtIsInputfieldCKEditorInline(langInputfieldContainer):
        return new FtInputfieldCKEditorInline(langInputfieldContainer);

      case FtIsInputfieldTinyMCE(langInputfieldContainer):
        return new FtInputfieldTinyMCE(langInputfieldContainer);

      case FtIsInputfieldTinyMCEInline(langInputfieldContainer):
        return new FtInputfieldTinyMCEInline(langInputfieldContainer);

      case FtIsInputfieldTextarea(langInputfieldContainer):
        return new FtInputfieldTextarea(langInputfieldContainer);

      case FtIsInputfieldText(langInputfieldContainer):
        return new FtInputfieldText(langInputfieldContainer);

      default:
        if (ProcessWire.config.debug) {
          console.warn(
            'Fluency does not recognize this inputfield, translation is not available',
            langInputfieldContainer,
          );
        }

        return null;
    }
  };

  /**
   * This sets a mutation observer on the main content area of the edit page that will initialize
   * new fields that may be added on focus or triggered by AJAX actions
   *
   * @return {void}
   */
  const initInputfieldsOnInsertion = () => {
    const parentNode = document.getElementById('pw-content-body');

    new MutationObserver((mutations, observer) => {
      for (let mutation of mutations) {
        let targetEl = mutation.target;

        const foundEls = targetEl.querySelectorAll(langInputfieldClass);

        if (foundEls.length) {
          initInputfields(foundEls);
        }
      }
    }).observe(parentNode, {
      childList: true,
      subtree: true,
    });
  };

  /**
   * Initializes page name fields. Must be initialized separately since they do not
   * follow the structure of other inputfields
   * @return {void}
   */
  const initPageNameInputfields = () => {
    const pageNameInputfields = document.querySelectorAll('.InputfieldPageName');
    [...pageNameInputfields].forEach(pageNameInputfield => {
      if (pageNameInputfield && !fieldIsInitialized(pageNameInputfield)) {
        let inputfield = new FtInputfieldPageName(pageNameInputfield);

        setFieldIsInitialized(pageNameInputfield);

        if (!inputfield) {
          return;
        }
      }
    });
  };

  /**
   * Checks if a given field has been initialized
   * @param  {DOMNode} langInputfieldContainer Container element for multi-language field
   * @return {bool}
   */
  const fieldIsInitialized = langTabContainer =>
    langTabContainer.hasAttribute(FtConfig.fieldInitializedAttr) ||
    !!langTabContainer.querySelector('.ft-translate-button');

  /**
   * Marks a field as initialized by adding a data attribute to the container
   * @param  {DOMNode} langTabContainer Container element for multi-language field
   * @return {void}
   */
  const setFieldIsInitialized = langTabContainer =>
    langTabContainer.setAttribute(FtConfig.fieldInitializedAttr, '');

  /**
   * This updates the value of an input element such as text or textarea
   * When a field is updated it must be blurred so that it is recognized as having been changed and
   * the "unsaved changes" alert will be shown if navigating away from a page without saving
   * @param  {HTMLElement} inputEl Element
   * @param  {string}      value
   * @return {void}
   */
  const updateValue = (inputEl, value) => {
    inputEl.focus();
    inputEl.value = value;
    inputEl.blur();
  };

  return {
    init,
    updateValue,
    fieldIsInitialized,
  };
})();

export default FtInputfields;
