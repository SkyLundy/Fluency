// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"fWsaf":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _ftInputfields = require("./inputfields/FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftAdminMenu = require("./ui/FtAdminMenu");
var _ftAdminMenuDefault = parcelHelpers.interopDefault(_ftAdminMenu);
var _ftConfig = require("./global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
// Each module has its own checks to determine if they should initialize
window.addEventListener('load', (e)=>{
    if ((0, _ftConfigDefault.default).moduleShouldInitialize()) {
        (0, _ftAdminMenuDefault.default).init();
        (0, _ftInputfieldsDefault.default).init();
    }
});

},{"./inputfields/FtInputfields":"6uJdZ","./ui/FtAdminMenu":"co4Kc","./global/FtConfig":"6zv3w","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"6uJdZ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfieldCKEditor = require("./FtInputfieldCKEditor");
var _ftInputfieldCKEditorInline = require("./FtInputfieldCKEditorInline");
var _ftInputfieldTable = require("./FtInputfieldTable");
var _ftInputfieldText = require("./FtInputfieldText");
var _ftInputfieldTextarea = require("./FtInputfieldTextarea");
var _ftInputfieldTinyMCE = require("./FtInputfieldTinyMCE");
var _ftInputfieldTinyMCEInline = require("./FtInputfieldTinyMCEInline");
var _ftInputfieldPageName = require("./FtInputfieldPageName");
var _ftInputfieldPageNameDefault = parcelHelpers.interopDefault(_ftInputfieldPageName);
/**
 * Orchestration for initializing all multilanguage inputfields on a page
 * @return {Object}   Public interface methods
 */ const FtInputfields = function() {
    /**
   * Selector used to find translatable Inputfields
   * All inputfield containers on the page that are multilanguage have this class
   * @type {String}
   */ const langInputfieldClass = "[class*='hasLangTabs']";
    /**
   * Attribute present where per-field translation is disabled
   * @type {String}
   */ const disableTranslationAttr = (0, _ftConfigDefault.default).getTranslationDisabledFieldAttribute();
    /**
   * Initializes multilanguage fields if present on page
   * @return {void}
   */ const init = function() {
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
   */ const initInputfields = (langInputfieldContainers)=>{
        for (let langInputfieldContainer of langInputfieldContainers){
            if (translationIsDisabled(langInputfieldContainer)) continue;
            initInputfield(langInputfieldContainer);
        }
    };
    /**
   * Determines if a provided language inputfield has had Fluency translation disabled
   * @param  {HTMLElement} langInputfieldContainer
   * @return {Bool}
   */ const translationIsDisabled = (langInputfieldContainer)=>!!langInputfieldContainer.querySelectorAll(disableTranslationAttr).length;
    /**
   * Initializes the field within a container
   * @param  {Element} langInputfieldContainer Element containing inputfield
   * @return {void}
   */ const initInputfield = (langInputfieldContainer)=>{
        // Do not initialize fields that have already been initialized
        // Do not initialized fields that are a list element and not an Inputfield themselves
        if (!fieldIsInitialized(langInputfieldContainer) && !langInputfieldContainer.classList.contains('InputfieldItemList') && !isInputfieldTemplate(langInputfieldContainer)) {
            let inputfield = getFtInputfieldObject(langInputfieldContainer);
            setFieldIsInitialized(langInputfieldContainer);
            if (!inputfield) return;
        }
    };
    /**
   * Detect if Inputfield container is a hidden template element used to dynamically create new
   * Inputfields on demand
   * @param  {Element} langInputfieldContainer
   * @return {Bool}
   */ const isInputfieldTemplate = (langInputfieldContainer)=>!!langInputfieldContainer.closest("[class*='Template']");
    /**
   * Initializes a FtInputfield object instance by type
   * Order of checks is important Complex fields should be cased higher
   * Fields with lower complexity should be cased last to prevent catching simple elements in
   * complex fields that use simple inputs
   * @param  {Element} langInputfieldContainers
   * @return {?Object}
   */ const getFtInputfieldObject = (langInputfieldContainer)=>{
        switch(true){
            case (0, _ftInputfieldTable.FtIsInputfieldTable)(langInputfieldContainer):
                // Initialize all new fields which have a different class than top-level fields
                initInputfields(langInputfieldContainer.querySelectorAll('.langTabs'));
                break;
            case (0, _ftInputfieldCKEditor.FtIsInputfieldCKEditor)(langInputfieldContainer):
                return new (0, _ftInputfieldCKEditor.FtInputfieldCKEditor)(langInputfieldContainer);
            case (0, _ftInputfieldCKEditorInline.FtIsInputfieldCKEditorInline)(langInputfieldContainer):
                return new (0, _ftInputfieldCKEditorInline.FtInputfieldCKEditorInline)(langInputfieldContainer);
            case (0, _ftInputfieldTinyMCE.FtIsInputfieldTinyMCE)(langInputfieldContainer):
                return new (0, _ftInputfieldTinyMCE.FtInputfieldTinyMCE)(langInputfieldContainer);
            case (0, _ftInputfieldTinyMCEInline.FtIsInputfieldTinyMCEInline)(langInputfieldContainer):
                return new (0, _ftInputfieldTinyMCEInline.FtInputfieldTinyMCEInline)(langInputfieldContainer);
            case (0, _ftInputfieldTextarea.FtIsInputfieldTextarea)(langInputfieldContainer):
                return new (0, _ftInputfieldTextarea.FtInputfieldTextarea)(langInputfieldContainer);
            case (0, _ftInputfieldText.FtIsInputfieldText)(langInputfieldContainer):
                return new (0, _ftInputfieldText.FtInputfieldText)(langInputfieldContainer);
            default:
                if (ProcessWire.config.debug) console.warn('Fluency does not recognize this inputfield, translation is not available', langInputfieldContainer);
                return null;
        }
    };
    /**
   * This sets a mutation observer on the main content area of the edit page that will initialize
   * new fields that may be added on focus or triggered by AJAX actions
   *
   * @return {void}
   */ const initInputfieldsOnInsertion = ()=>{
        const parentNode = document.getElementById('pw-content-body');
        new MutationObserver((mutations, observer)=>{
            for (let mutation of mutations){
                let targetEl = mutation.target;
                const foundEls = targetEl.querySelectorAll(langInputfieldClass);
                if (foundEls.length) initInputfields(foundEls);
            }
        }).observe(parentNode, {
            childList: true,
            subtree: true
        });
    };
    /**
   * Initializes page name fields. Must be initialized separately since they do not
   * follow the structure of other inputfields
   * @return {void}
   */ const initPageNameInputfields = ()=>{
        const pageNameInputfields = document.querySelectorAll('.InputfieldPageName');
        [
            ...pageNameInputfields
        ].forEach((pageNameInputfield)=>{
            if (pageNameInputfield && !fieldIsInitialized(pageNameInputfield)) {
                let inputfield = new (0, _ftInputfieldPageNameDefault.default)(pageNameInputfield);
                setFieldIsInitialized(pageNameInputfield);
                if (!inputfield) return;
            }
        });
    };
    /**
   * Checks if a given field has been initialized
   * @param  {DOMNode} langInputfieldContainer Container element for multi-language field
   * @return {bool}
   */ const fieldIsInitialized = (langTabContainer)=>langTabContainer.hasAttribute((0, _ftConfigDefault.default).fieldInitializedAttr) || !!langTabContainer.querySelector('.ft-translate-button');
    /**
   * Marks a field as initialized by adding a data attribute to the container
   * @param  {DOMNode} langTabContainer Container element for multi-language field
   * @return {void}
   */ const setFieldIsInitialized = (langTabContainer)=>langTabContainer.setAttribute((0, _ftConfigDefault.default).fieldInitializedAttr, '');
    /**
   * This updates the value of an input element such as text or textarea
   * When a field is updated it must be blurred so that it is recognized as having been changed and
   * the "unsaved changes" alert will be shown if navigating away from a page without saving
   * @param  {HTMLElement} inputEl Element
   * @param  {string}      value
   * @return {void}
   */ const updateValue = (inputEl, value)=>{
        inputEl.focus();
        inputEl.value = value;
        inputEl.blur();
    };
    return {
        init,
        updateValue,
        fieldIsInitialized
    };
}();
exports.default = FtInputfields;

},{"../global/FtConfig":"6zv3w","./FtInputfieldCKEditor":"65Yvj","./FtInputfieldCKEditorInline":"cXw5E","./FtInputfieldTable":"2PBQw","./FtInputfieldText":"fbcvo","./FtInputfieldTextarea":"cQV0O","./FtInputfieldTinyMCE":"9u4MI","./FtInputfieldTinyMCEInline":"95dR0","./FtInputfieldPageName":"bgpdx","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"6zv3w":[function(require,module,exports,__globalThis) {
/**
 * This provides access methods to get module configuration values
 * @return {Object}  Public methods
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const FtConfig = function() {
    // Public properties
    const fieldInitializedAttr = 'data-ft-initialized';
    const translationActionTypes = {
        each: 'translate_each_language',
        all: 'translate_to_all_languages',
        both: 'both'
    };
    // Private properties
    /**
   * Holds the data passed from the Fluency module
   * @access Private
   * @type {Object}
   */ const config = ProcessWire.config.fluency;
    /**
   * All UI strings
   * @type {Object}
   */ const localizedStrings = config.localization;
    /**
   * Classes for elements created in UI
   * @type {Object}
   */ const elementClasses = {
        translateButton: {
            container: 'ft-translate-button-container',
            button: 'ft-translate-button'
        },
        languageTranslator: {
            container: 'Inputfield InputfieldHeaderHidden',
            content: 'InputfieldContent ft-language-translator-button-content',
            translateButton: 'ft-translate-all-button',
            sourceLanguageSelect: 'uk-select ft-source-language-select',
            sourceLanguageSelectLabel: 'ft-source-language-select-label'
        },
        statusPlaceholder: {
            container: 'ft-translation-status-container',
            label: 'ft-translation-status'
        },
        icon: 'ft-icon'
    };
    /**
   * Objects interface with the Fluency config object so that changes to the object
   * structure from the back end do not break the UI. Use the public methods below
   * to access ProcessWire.config.fluency properties and data
   */ /**
   * Localized strings keyed sets
   * @type {Object}
   */ const strings = {
        activityOverlay: localizedStrings.activityOverlay,
        languageSelect: localizedStrings.languageSelect,
        inputfieldTranslateButtons: localizedStrings.inputfieldTranslateButtons,
        standaloneTranslator: localizedStrings.standaloneTranslator,
        usage: localizedStrings.usage,
        errors: localizedStrings.errors,
        languageTranslator: localizedStrings.languageTranslator
    };
    /**
   * Fluency API keyed URLs
   * @type {Object}
   */ const endpoints = {
        languages: config.apiEndpoints.languages,
        translatableLanguagesCache: config.apiEndpoints.translatableLanguagesCache,
        test: config.apiEndpoints.test,
        translation: config.apiEndpoints.translation,
        translationCache: config.apiEndpoints.translationCache,
        usage: config.apiEndpoints.usage
    };
    /**
   * Contains all of the Fluency configured langauges from the module
   * @type {Array}
   */ const configuredLanguages = config.configuredLanguages;
    /**
   * Contains an array of ProcessWire language IDs not configured in Fluency
   * @type {Array}
   */ const unconfiguredLanguages = config.unconfiguredLanguages;
    // Public methods
    /**
   * Fluency REST API
   */ const getApiEndpointFor = (key)=>endpoints[key];
    /**
   * Languages
   */ /**
   * Get all configured languages
   * @return {object}
   */ const getConfiguredLanguages = ()=>configuredLanguages;
    /**
   * Returns ProcessWire's default language
   * @return {object}
   */ const getDefaultLanguage = ()=>getConfiguredLanguages().reduce((defaultLang, lang)=>lang.default ? lang : defaultLang, null);
    /**
   * Determines if the language with a given ProcessWire ID can be translated
   * @param  {int|string} languageId ProcessWire language ID
   * @return {bool}
   */ const languageIsTranslatable = (languageId)=>!getUnconfiguredLanguages().includes(parseInt(languageId, 10));
    /**
   * Get all languages not configured in Fluency
   * @return {object}
   */ const getUnconfiguredLanguages = ()=>unconfiguredLanguages;
    /**
   * Gets total count of configured and unconfigured languages
   * @return {int}
   */ const getLanguageCount = ()=>getConfiguredLanguages().length + getUnconfiguredLanguages().length;
    /**
   * Get a configured language by it's ProcessWire ID
   * @param  {string|int} pwLanguageId ProcessWire language ID
   * @return {object}
   */ const getLanguageForId = (pwLanguageId)=>{
        pwLanguageId = parseInt(pwLanguageId, 10);
        return getConfiguredLanguages().reduce((match, language)=>language.id === pwLanguageId ? language : match, null);
    };
    /**
   * Localization
   */ /**
   * Accessor method for localized UI strings
   * @param  {string} key Object key
   * @return {string}
   */ const getUiTextFor = (key)=>strings[key];
    /**
   * Module Configuration/State
   */ /**
   * Determines if Fluency JS should initialize based on whether languages have
   * been configured
   * @return {bool}
   */ const moduleShouldInitialize = ()=>getConfiguredLanguages().length > 1;
    /**
   * Returns the translation engine config object for the engine configured in Fluency
   * @return {object|null}
   */ const getEngineInfo = ()=>config.engine;
    /**
   * Does this engine provide usage data?
   * @return {bool}
   */ const getEngineProvidesUsageData = ()=>getEngineInfo().providesUsageData;
    /**
   * Gets the type of translation action chosen in the Flunecy module config
   * @return {string}
   */ const getTranslationAction = ()=>config.interface.inputfieldTranslationAction;
    /**
   * The attribute added to individual field elements where translation has been disabled
   * @return {string}
   */ const getTranslationDisabledFieldAttribute = ()=>`[${config.interface.translationDisabledFieldAttr}]`;
    /**
   * Class names added to UI components
   * @param  {string} element The type of component
   * @return {string}
   */ const getElementClassesFor = (element)=>elementClasses[element];
    return {
        fieldInitializedAttr,
        getApiEndpointFor,
        getConfiguredLanguages,
        getDefaultLanguage,
        getElementClassesFor,
        getEngineInfo,
        getEngineProvidesUsageData,
        getLanguageCount,
        getLanguageForId,
        getTranslationAction,
        getTranslationDisabledFieldAttribute,
        getUiTextFor,
        getUnconfiguredLanguages,
        languageIsTranslatable,
        moduleShouldInitialize,
        translationActionTypes
    };
}();
exports.default = FtConfig;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"5oERU":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"65Yvj":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldCKEditor", ()=>FtIsInputfieldCKEditor);
parcelHelpers.export(exports, "FtInputfieldCKEditor", ()=>FtInputfieldCKEditor);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Determines if a given inputfield contains a regular CKEditor instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */ const FtIsInputfieldCKEditor = (inputfield)=>!!inputfield.querySelector('.InputfieldCKEditorNormal');
/**
 * Handles translations for CKEditor Inputfields
 * @return {object}  Public methods
 */ const FtInputfieldCKEditor = function(inputfield) {
    /**
   * Contains values for all fields/languages keyed by ProcessWire language ID.
   * Populated on object instantiation
   *
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {String} Inputfield content
   * @type {Object}
   */ const changedValues = {};
    /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type     {Object}
   */ const languageTabs = {};
    /**
   * Will contain all language input containers keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type {Object}
   */ const inputContainers = {};
    /**
   * Will contain all CKEditor instances
   * @property {String} ProcessWire Language ID
   * @value    {CKEditor|null}
   * @type     {Object}
   */ const editorInstances = {};
    /**
   * Will contain the base CKEditor instance ID that can be used to get the default CKEditor instance
   * using the CKEditor API, or another instance by modifying this one.
   * Set on FtInputfieldCKEditor instantiation
   * @type {?String}
   */ let defaultLanguageInstanceId = null;
    /**
   * This is the base inputfield ID that does not have a language ID appended
   * ex. Inputfield_example vs Inputfield_example__1028
   * @type {?String}
   */ let inputfieldBaseId = null;
    /**
   * Activity overlay object, set on instantiation
   *
   * @access public
   * @type {Object}
   */ let activityOverlay;
    /**
   * Gets existing or instantiates a new activity overlay
   *
   * @access public
   * @return {Object}
   */ this.getActivityOverlay = ()=>activityOverlay;
    /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @access public
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * @access public
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>this.getEditorInstanceForLanguage(languageId).getData();
    /**
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const instance = this.getEditorInstanceForLanguage(languageId);
        instance.setData(value);
        instance.fire('change');
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and Admin listeners work
        $(instance).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * Attempts to get the CKEditor instance for a given language ID. This method should
   * be used exclusively to get instances as it also sets event listeners for content
   * changes if they have been instantiated after FtInputfieldCKEditor has loaded
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?CKEditor}
   */ this.getEditorInstanceForLanguage = (languageId)=>{
        if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) return editorInstances[languageId];
        const editorSelectorByLanguageId = [
            inputfieldBaseId,
            languageId
        ].filter((val)=>!!val).join('__');
        let editor = CKEDITOR.instances[editorSelectorByLanguageId];
        // If ther was no editor found with this ID then a different default language has been set
        // and the CKEditor instance will be found without an ID appended
        if (!editor) editor = CKEDITOR.instances[inputfieldBaseId];
        editorInstances[languageId] = editor;
        return editorInstances[languageId];
    };
    /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        this.getSelf().querySelectorAll('[data-language]').forEach((el)=>{
            inputContainers[el.dataset.language] = el;
        });
        return inputContainers;
    };
    /**
   * @access private
   * @param  {Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    /**
   * Registers the event listener that watches for content changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {void}
   */ this.registerInputEventListener = (languageId)=>{
        this.getEditorInstanceForLanguage(languageId).on('change', (e)=>{
            changedValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
        });
    };
    /**
   * Initialized the uninitialized
   * @access private
   * @return {void}
   */ this.initContainers = ()=>{
        const allInputContainers = this.getInputContainers();
        // The first input container will have an inputfield ID without any language ID appended
        inputfieldBaseId = Object.values(allInputContainers)[0].id.replace('langTab_', '');
        const defaultLanguageProcessWireId = (0, _ftConfigDefault.default).getDefaultLanguage().id.toString();
        const containerElements = Object.values(allInputContainers);
        for(var i = containerElements.length - 1; i >= 0; i--){
            let containerId = containerElements[i].id;
            if (containerId.endsWith(defaultLanguageProcessWireId)) {
                defaultLanguageInstanceId = containerId.replace('langTab_', '');
                break;
            }
        }
        for(let languageId in allInputContainers){
            let inputContainer = allInputContainers[languageId];
            editorInstances[languageId] = this.getEditorInstanceForLanguage(languageId);
            languageTabs[languageId] = new (0, _ftLanguageTabDefault.default)(inputContainer);
            this.registerInputEventListener(languageId);
        }
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers);
    };
    /**
   * Init on object instantiation
   * @access private
   * @return {Void}
   */ (()=>{
        if (CKEDITOR === undefined) {
            console.error('CKEditor was not found by Fluency, translation unavailable');
            return;
        }
        // CKEditor experiences a delay between being added to the DOM and a ready state in some
        // situations, notably after AJAX insertion. This was a lot easier than attempting to use the
        // CKEditor events API which fired off more events than editors
        setTimeout(this.initContainers, 50);
    })();
};

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"6pheB":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
/**
 * Creates, inserts, and controls the actions the activity overlay for the provided
 * targetContainer
 * @param {object} targetContainer An instantiated object for an inputfield or fieldset
 * @param {string} type       The type of activity for this overlay. 'translate' or 'update'
 */ const FtActivityOverlay = function(targetContainer, activityType = 'translating') {
    const elClasses = {
        parent: 'ft-activity-overlay-container',
        overlay: 'ft-activity-overlay',
        error: 'error',
        message: 'message',
        flash: 'flash',
        activity: 'activity',
        visible: 'visible',
        activityContainer: 'ft-activity',
        activityStaticText: 'ft-activity-text',
        activityAnimationContainer: 'ft-activity-animation-container',
        activityAnimationItem: 'ft-activity-animation-item',
        messageContainer: 'ft-activity-message'
    };
    /**
   * Will contain the activityOverlay Element for this targetContainer
   * @type {Element}
   */ let activityOverlay;
    /**
   * Will contain the message Element for this targetContainer's activityOverlay
   * @type {Element}
   */ let messageContainer;
    /**
   * Will contain the animation container Element for this targetContainer's activityOverlay
   * @type {Element}
   */ let activityContainer;
    /**
   * Show the overlay's activity animation that was created at instantiation
   * @return {void}
   */ this.showActivity = ()=>{
        this.setActivityActive();
        this.setOverlayVisible();
    };
    /**
   * Shows a message in the overlay (neutral background)
   * @param  {String} message     Text to display
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {void}
   */ this.showMessage = (message, displayTime = 5000)=>{
        this.setMessageContent(message);
        this.setActivityInactive();
        this.setMessageActive();
        this.setOverlayVisible();
        this.hide(displayTime);
    };
    /**
   * Shows a success message (success color background)
   *
   * @param  {String} message     Text to display
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {void}
   */ this.flashSuccess = (message, displayTime = 500)=>{
        this.setSuccessActive();
        this.setFlashActive();
        this.showMessage(message, displayTime);
    };
    /**
   * Shows an error message (error color background)
   * @param  {String} message     Text to display
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {void}
   */ this.flashError = (message, displayTime = 500)=>{
        this.setFlashActive();
        this.setErrorActive();
        this.showMessage(message, displayTime);
    };
    /**
   * Shows an error message in a visible overlay (error background)
   * @param  {String} message     Message to show in overlay error
   * @param  {Number} displayTime Length of time in ms before hiding overlay after shown
   * @return {void}
   */ this.showError = (message, displayTime = 5000)=>{
        this.setErrorActive();
        this.showMessage(message, displayTime);
    };
    /**
   * Hide an overlay immediately or after a preset amount of time
   * @param {Number} delay Length of time in ms before hiding overlay
   */ this.hide = (delay = 0)=>{
        setTimeout(()=>{
            this.setOverlayInvisible();
        }, delay);
        // Ensures the animation is finished before modifying content
        setTimeout(()=>{
            this.setActivityInactive();
            this.setMessageInactive();
            this.setErrorInactive();
            this.setFlashInactive();
            this.setMessageContent('');
        }, delay + 500);
    };
    /**
   * Shows the activity element
   * @access Private
   */ this.setActivityActive = ()=>activityOverlay.classList.add(elClasses.activity);
    /**
   * Hides the activity element
   * @access Private
   */ this.setActivityInactive = ()=>activityOverlay.classList.remove(elClasses.activity);
    /**
   * Shows the message element
   * @access Private
   */ this.setMessageActive = ()=>activityOverlay.classList.add(elClasses.message);
    /**
   * Hides the activity element
   * @access Private
   */ this.setMessageInactive = ()=>activityOverlay.classList.remove(elClasses.message);
    /**
   * Sets the content of the overlay message
   * @access Private
   */ this.setMessageContent = (content)=>messageContainer.innerText = content;
    /**
   * Adds flashing overlay behavior
   * @access Private
   */ this.setFlashActive = ()=>activityOverlay.classList.add(elClasses.flash);
    /**
   * removes flashing overlay behavior
   * @access Private
   */ this.setFlashInactive = ()=>activityOverlay.classList.remove(elClasses.flash);
    /**
   * Sets message to success
   * @access Private
   */ this.setSuccessActive = ()=>activityOverlay.classList.add(elClasses.success);
    /**
   * Unsets success message
   * @access Private
   */ this.setSuccessInactive = ()=>activityOverlay.classList.remove(elClasses.success);
    /**
   * Sets message to error
   * @access Private
   */ this.setErrorActive = ()=>activityOverlay.classList.add(elClasses.error);
    /**
   * Unsets message error
   * @access Private
   */ this.setErrorInactive = ()=>activityOverlay.classList.remove(elClasses.error);
    /**
   * Shows this activity overlay
   * @access Private
   */ this.setOverlayVisible = ()=>activityOverlay.classList.add(elClasses.visible);
    /**
   * Hides this activity overlay
   * @access Private
   */ this.setOverlayInvisible = ()=>activityOverlay.classList.remove(elClasses.visible);
    /**
   * Creates and returns an activity overlay element
   * @return {HTMLElement}
   */ this.create = ()=>{
        activityOverlay = this.buildOverlayEl();
        activityContainer = this.buildActivityEl();
        messageContainer = this.buildMessageEl();
        activityOverlay.appendChild(activityContainer);
        activityOverlay.appendChild(messageContainer);
        return activityOverlay;
    };
    /**
   * Creates the parent overlay element
   * @return {Element}
   * @access Private
   */ this.buildOverlayEl = ()=>{
        const overlay = document.createElement('div');
        overlay.setAttribute('class', elClasses.overlay);
        return overlay;
    };
    /**
   * Creates container for animation and contents of animation
   * @return {Element}
   * @access Private
   */ this.buildActivityEl = ()=>{
        let text = this.getActivityTexts();
        let activityAnimationContainer = document.createElement('div');
        activityAnimationContainer.setAttribute('class', elClasses.activityAnimationContainer);
        // Add all animation items to the animation container
        activityAnimationContainer = text.animated.reduce((el, string)=>{
            let activityText = document.createElement('span');
            // Add text items
            activityText.setAttribute('class', elClasses.activityAnimationItem);
            activityText.innerHTML = string;
            el.appendChild(activityText);
            return el;
        }, activityAnimationContainer);
        // Create static text element
        let staticText = document.createElement('div');
        staticText.setAttribute('class', elClasses.activityStaticText);
        staticText.innerText = text.static;
        // Create activity container and append children
        activityContainer = document.createElement('div');
        activityContainer.setAttribute('class', elClasses.activityContainer);
        activityContainer.appendChild(staticText);
        activityContainer.appendChild(activityAnimationContainer);
        return activityContainer;
    };
    /**
   * Gets activity overlay texts and shuffles the animated array
   * No purpose really other than to add some uniqueness to overlay animations and prevent looking
   * like one language was preferred by me over another.
   *
   * Fisher-Yates algorithm, for the curious
   * @return {Array} Randomized array of the activity animation texts for this instance
   * @access Private
   */ this.getActivityTexts = ()=>{
        let uiTexts = (0, _ftConfigDefault.default).getUiTextFor('activityOverlay')[activityType];
        let animationTexts = uiTexts.animated;
        for(let i = animationTexts.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            let temp = animationTexts[i];
            animationTexts[i] = animationTexts[j];
            animationTexts[j] = temp;
        }
        uiTexts.animated = animationTexts;
        return uiTexts;
    };
    /**
   * Builds the element that will hold messages in the overlay
   * @return {Element}
   * @access Private
   */ this.buildMessageEl = ()=>{
        messageContainer = document.createElement('div');
        messageContainer.setAttribute('class', elClasses.messageContainer);
        return messageContainer;
    };
    (()=>{
        const targetContainerContainer = targetContainer.getSelf();
        activityOverlay = this.create();
        targetContainerContainer.classList.add(elClasses.parent);
        targetContainerContainer.appendChild(activityOverlay);
    })();
};
exports.default = FtActivityOverlay;

},{"../global/FtConfig":"6zv3w","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"1qPYB":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _fluency = require("../global/Fluency");
var _fluencyDefault = parcelHelpers.interopDefault(_fluency);
var _ftUiElements = require("./FtUiElements");
var _ftUiElementsDefault = parcelHelpers.interopDefault(_ftUiElements);
/**
 * The translate button establishes the UI element used to trigger translations
 * by the user. It manages the translation process by displaying/hiding the
 * activity overlay, showing messages and errors, getting translations from
 * the Fluency API, and modifying content. This is done by manipulating the
 * inputfield and activityOverlay objects passed.
 */ /**
 * @param {Element}  inputfield
 * @param {NodeList}  inputContainers
 * @param {Boolean} forceEachTranslationAction Force a single field translation trigger
 */ const FtInputfieldTranslateButton = function(inputfield, inputContainers, forceEachTranslationAction = false) {
    /**
   * Gets all localized strings from the FluencyConfig object
   * @type {object}
   */ const uiText = (0, _ftConfigDefault.default).getUiTextFor('inputfieldTranslateButtons');
    /**
   * Adds translate elements to inputfield containers
   * @param  {string|int} languageId     ProcessWire language ID
   * @param  {Element}    inputContainer Inputcontainer for this language
   * @return {void}
   */ this.addTranslateFromDefaultButton = (languageId, inputContainer)=>{
        const isTranslatable = (0, _ftConfigDefault.default).languageIsTranslatable(languageId);
        const isDefaultLanguage = languageId == (0, _ftConfigDefault.default).getDefaultLanguage().id;
        if (!isTranslatable) {
            inputContainer.appendChild((0, _ftUiElementsDefault.default).createStatusElement(uiText.languageNotAvailable));
            return;
        }
        if (isDefaultLanguage) {
            inputContainer.appendChild((0, _ftUiElementsDefault.default).createStatusElement(uiText.translationAvailable));
            return;
        }
        const { button, container } = (0, _ftUiElementsDefault.default).createTranslateButton(uiText.translateButton);
        this.bindButton(button, (0, _ftConfigDefault.default).getLanguageForId(languageId));
        inputContainer.appendChild(container);
    };
    /**
   * Binds a button for translation
   * @param  {Element} buttonElement Element to bind translation action to
   * @param  {Object} languageConfig Fluency language configuration object
   * @return {Void}
   */ this.bindButton = (buttonElement, languageConfig)=>{
        buttonElement.addEventListener('click', (e)=>{
            e.preventDefault();
            const translationSourceContent = inputfield.getValueForDefaultLanguage();
            if (!translationSourceContent) return;
            // Try to get the inputfield activity overlay, fall back to retrieving by language ID where
            // the inputfield element can delegate to a specific activity overlay located within it
            const activityOverlay = inputfield.getActivityOverlay() ?? inputfield.getActivityOverlay(languageConfig.id);
            activityOverlay.showActivity();
            (0, _fluencyDefault.default).getTranslation((0, _ftConfigDefault.default).getDefaultLanguage().engineLanguage.sourceCode, languageConfig.engineLanguage.targetCode, translationSourceContent).then((result)=>{
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
   * @param  {int}          sourceLanguageId     ProcessWire language ID
   * @param  {HTMLElements} inputContainers      All language input containers for this inputfield
   * @return {void}
   */ this.addTranslateToAllButton = (sourceLanguageId, inputContainers)=>{
        const isTranslatable = (0, _ftConfigDefault.default).languageIsTranslatable(sourceLanguageId);
        const sourceInputContainer = inputContainers[sourceLanguageId];
        if (!isTranslatable) {
            sourceInputContainer.appendChild((0, _ftUiElementsDefault.default).createStatusElement(uiText.languageNotAvailable));
            return;
        }
        const { button, container } = (0, _ftUiElementsDefault.default).createTranslateButton(uiText.translateToAllButton);
        this.bindTranslateToAllButton(button, (0, _ftConfigDefault.default).getLanguageForId(sourceLanguageId), inputContainers);
        sourceInputContainer.appendChild(container);
    };
    /**
   * Binds translation action to button that translates to all other languages
   * @param  {Element}  buttonElement        Button to bind
   * @param  {object}   sourceLanguageConfig The FtConfig object for the source language
   * @param  {HTMLElements} inputContainers   All language input containers for this inputfield
   * @return {void}
   */ this.bindTranslateToAllButton = (buttonElement, sourceLanguageConfig, inputContainers)=>{
        buttonElement.addEventListener('click', (e)=>{
            e.preventDefault();
            const translationSourceContent = inputfield.getValueForLanguage(sourceLanguageConfig.id);
            // Do not translate if there's no source content or risk content in other languages to
            // be removed
            if (!translationSourceContent) return;
            // Used to count the number of languages left when translating to all
            let translationLanguageCount = Object.keys(inputContainers).length;
            let errorOccurred = false;
            let activityOverlay = inputfield.getActivityOverlay();
            activityOverlay.showActivity();
            for(let targetLanguageId in inputContainers){
                targetLanguageId = parseInt(targetLanguageId, 10);
                let targetLanguageConfig = (0, _ftConfigDefault.default).getLanguageForId(targetLanguageId);
                // No need to translate source if present
                // Skip if source or target languages are not configured in Fluency
                if (targetLanguageId === sourceLanguageConfig.id || !sourceLanguageConfig || !targetLanguageConfig) {
                    translationLanguageCount--;
                    continue;
                }
                (0, _fluencyDefault.default).getTranslation(sourceLanguageConfig.engineLanguage.sourceCode, targetLanguageConfig.engineLanguage.targetCode, translationSourceContent).then((result)=>{
                    if (result.error) {
                        // Only show the error overlay if an error has not already occurred
                        if (!errorOccurred) inputfield.getActivityOverlay().showError(result.message);
                        errorOccurred = true;
                        return;
                    }
                    inputfield.setValueForLanguage(targetLanguageConfig.id, result.translations[0]);
                }).then((result)=>{
                    translationLanguageCount--;
                    // If an error occurred, messaging/overlay will be handled by the error process
                    if (translationLanguageCount === 0 && !errorOccurred) activityOverlay.hide();
                });
            }
        });
    };
    this.addBothTranslationButtonTypes = (languageId, inputContainers)=>{
        this.addTranslateToAllButton(languageId, inputContainers);
        this.addTranslateFromDefaultButton(languageId, inputContainers[languageId]);
    };
    /**
   * Init on object instantiation
   */ (()=>{
        const actionTypes = (0, _ftConfigDefault.default).translationActionTypes;
        const translationAction = (0, _ftConfigDefault.default).getTranslationAction();
        for(let languageId in inputContainers){
            if (translationAction === actionTypes.all && !forceEachTranslationAction) this.addTranslateToAllButton(languageId, inputContainers);
            if (translationAction === actionTypes.each || forceEachTranslationAction) this.addTranslateFromDefaultButton(languageId, inputContainers[languageId]);
            if (translationAction === actionTypes.both && !forceEachTranslationAction) {
                this.addTranslateToAllButton(languageId, inputContainers);
                this.addTranslateFromDefaultButton(languageId, inputContainers[languageId]);
            }
        }
    })();
};
exports.default = FtInputfieldTranslateButton;

},{"../global/FtConfig":"6zv3w","../global/Fluency":"eBBeI","./FtUiElements":"gX41L","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"eBBeI":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ftConfig = require("./FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
/**
 * Core module interface
 * Handles all interaction with the ProcessWire module backend
 * @return {object} Public interfaces
 */ const Fluency = function() {
    /**
   * Localized error strings
   * @type {Object}
   */ const errors = (0, _ftConfigDefault.default).getUiTextFor('errors');
    /**
   * Data Request Methods
   */ /**
   * Gets a translation from the Fluency module
   * @param  {String}       sourceLanguage ISO language code
   * @param  {String}       targetLanguage ISO langauge code
   * @param  {String|Array} content        Content to translate
   * @param  {Array}        options        Additional options
   * @param  {Bool|null}         caching        Enable/disable caching
   * @return {Promise}
   */ const getTranslation = (sourceLanguage, targetLanguage, content, options = [], caching = null)=>{
        return postRequest((0, _ftConfigDefault.default).getApiEndpointFor('translation'), {
            sourceLanguage: sourceLanguage,
            targetLanguage: targetLanguage,
            content: content,
            options: options,
            caching: caching
        }, (response)=>{
            return response;
        });
    };
    /**
   * Gets the current translation service API usage
   * @return {Promise}
   */ const getUsage = ()=>{
        return getRequest((0, _ftConfigDefault.default).getApiEndpointFor('usage'), (response)=>{
            return response;
        });
    };
    /**
   * Get all language available for translation. Provides source/target lists from the translation
   * service API
   * @return {Promise}
   */ const getAvailableLanguages = ()=>{
        return getRequest((0, _ftConfigDefault.default).getApiEndpointFor('languages'), (response)=>{
            return response;
        });
    };
    /**
   * Clear all cached translations
   * @return {Promise}
   */ const deleteTranslationCache = ()=>{
        return deleteRequest((0, _ftConfigDefault.default).getApiEndpointFor('translationCache'), (response)=>{
            return response;
        });
    };
    /**
   * Clear cached list of translatable languages
   * @return {Promise}
   */ const deleteTranslatableLanguagesCache = ()=>{
        return deleteRequest((0, _ftConfigDefault.default).getApiEndpointFor('translatableLanguagesCache'), (response)=>{
            return response;
        });
    };
    /**
   * HTTP Requests
   */ /**
   * Create headers for AJAX requests
   * @return {Object}
   */ const requestHeaders = (requestType)=>{
        const requestHeaders = {
            'X-Requested-With': 'XMLHttpRequest'
        };
        if (requestType === 'GET') requestHeaders['Accept'] = 'application/json';
        if (requestType === 'POST') requestHeaders['Content-Type'] = 'application/json';
        return requestHeaders;
    };
    /**
   * Executes a POST request to a given endpoint
   * @param  {String}    endpoint URL for AJAX request
   * @param  {Object}    data     Data for request
   * @param  {Callable}  data     Function to handle response body
   * @return {Promise}
   */ const postRequest = (endpoint, data, responseHandler)=>{
        return fetch(endpoint, {
            method: 'POST',
            cache: 'no-store',
            headers: requestHeaders,
            body: JSON.stringify(data)
        }).then(parseResponse).then(responseHandler).catch(handleFetchError);
    };
    /**
   * Executes a GET request to a given endpoint
   * @param  {String}   endpoint        URL for AJAX request
   * @param  {Callable} responseHandler Function to handle response body
   * @return {Promise}
   */ const getRequest = (endpoint, responseHandler)=>{
        return fetch(endpoint, {
            method: 'GET',
            cache: 'no-store',
            headers: requestHeaders('GET')
        }).then(parseResponse).then(responseHandler).catch(handleFetchError);
    };
    /**
   * Executes a DELETE request to a given endpoint
   * @param  {String}   endpoint        URL for AJAX request
   * @param  {Callable} responseHandler Function to handle response body
   * @return {Promise}
   */ const deleteRequest = (endpoint, responseHandler)=>{
        return fetch(endpoint, {
            method: 'DELETE',
            headers: requestHeaders('GET')
        }).then(parseResponse).then(responseHandler).catch(handleFetchError);
    };
    /**
   * Parses response
   * @param  {Object} response Fluency API response
   * @return {Object|Void}
   * @throws Error
   */ const parseResponse = (response)=>{
        if (response.status === 204) return response;
        if (response.ok) return response.json();
        throw new Error();
    };
    /**
   * Parses and returns results for a fetch error
   * These are network level errors that occur between ProcessWire and the hosting server
   * Any translation or service errors will be located within the response body itself
   * @param  {Error} error Fetch API error object
   * @return {Object}
   */ const handleFetchError = (error)=>{
        console.error('[Fluency module API failure]', error.message);
        const returnObject = {
            error: null,
            message: null
        };
        switch(error.message.split(' ')[0]){
            case 'NetworkError':
                returnObject.error = 'FLUENCY_CLIENT_DISCONNECTED';
                returnObject.message = errors['FLUENCY_CLIENT_DISCONNECTED'];
                break;
            default:
                returnObject.error = 'UNKNOWN_ERROR';
                returnObject.message = errors['UNKNOWN_ERROR'];
                break;
        }
        return returnObject;
    };
    return {
        deleteTranslatableLanguagesCache,
        deleteTranslationCache,
        getAvailableLanguages,
        getTranslation,
        getUsage
    };
}();
exports.default = Fluency;

},{"./FtConfig":"6zv3w","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"gX41L":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _fluency = require("../global/Fluency");
var _fluencyDefault = parcelHelpers.interopDefault(_fluency);
/**
 * Creates common HTML elements
 *
 * @return {Object} Public methods
 */ const FtUiElements = function() {
    /**
   * @type {Object}
   */ const elementClasses = (0, _ftConfigDefault.default).elementClasses;
    /**
   * Gets all localized strings from the FluencyConfig object
   * These do nothing on their own and must be bound with any behavior after creation
   * @type {object}
   */ const uiText = (0, _ftConfigDefault.default).getUiTextFor('inputfieldTranslateButtons');
    /**
   * Creates a language fontawesome icon element
   * @return {Element}
   */ const createIcon = ()=>{
        const iconLink = document.createElement('a');
        iconLink.setAttribute('href', `${ProcessWire.config.urls.admin}fluency/?modal=1`);
        iconLink.setAttribute('class', 'pw-modal pw-modal-large');
        const icon = document.createElement('i');
        icon.setAttribute('class', `${(0, _ftConfigDefault.default).getElementClassesFor('icon')} fa fa-language`);
        icon.setAttribute('uk-tooltip', uiText.showTranslator);
        iconLink.appendChild(icon);
        return iconLink;
    };
    /**
   * Creates a status placeholder
   * @param  {string} text Button text
   * @return {Element}
   */ const createStatusElement = (text)=>{
        const elClasses = (0, _ftConfigDefault.default).getElementClassesFor('statusPlaceholder');
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
   */ const createTranslateButton = (text)=>{
        const elClasses = (0, _ftConfigDefault.default).getElementClassesFor('translateButton');
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
            container
        };
    };
    /**
   * Creates the translate to all for the language translator pages
   * @param  {string} text Button label
   * @return {Element}
   */ const createLanguageTranslatorInputs = ()=>{
        const elClasses = (0, _ftConfigDefault.default).getElementClassesFor('languageTranslator');
        const texts = (0, _ftConfigDefault.default).getUiTextFor('languageTranslator');
        // Translate All button
        const translateAllButton = document.createElement('a');
        translateAllButton.innerText = texts.translateAllButton;
        translateAllButton.setAttribute('class', elClasses.translateButton);
        translateAllButton.setAttribute('href', '');
        // Source language select
        const sourceLanguageSelect = document.createElement('select');
        sourceLanguageSelect.setAttribute('class', elClasses.sourceLanguageSelect);
        // Source language select options
        (0, _ftConfigDefault.default).getConfiguredLanguages().forEach(function(language) {
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
            container
        };
    };
    return {
        createStatusElement,
        createTranslateButton,
        createLanguageTranslatorInputs,
        createIcon,
        elementClasses
    };
}();
exports.default = FtUiElements;

},{"../global/FtConfig":"6zv3w","../global/Fluency":"eBBeI","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"iH796":[function(require,module,exports,__globalThis) {
/**
 * A stateful function handling  behaviors for a language tab associated with a input container
 * contained within an Inputfield. An "input container" is the div that contains the label and
 * input/textarea/element (depending on Inputfield type) for a language
 * @param {Element} inputContainer Language
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const FtLanguageTab = function(inputContainer) {
    /**
   * Note
   * @type {String}
   */ const contentModifiedClass = 'ft-content-changed';
    /**
   * Cached associated tab for this input container
   * @type {Element}
   */ let languageTab = null;
    this.getContentModifiedClass = ()=>contentModifiedClass;
    /**
   * Sets state of tab
   * @param  {bool} modified Determines state of tab display
   * @return {void}
   */ this.setModifiedState = (modified)=>modified ? this.setTabModified() : this.setTabUnmodified();
    this.setTabModified = ()=>this.getLanguageTab().classList.add(contentModifiedClass);
    this.setTabUnmodified = ()=>this.getLanguageTab().classList.remove(contentModifiedClass);
    this.getLanguageTab = ()=>{
        return languageTab ?? inputContainer.closest('.langTabs').querySelector(`.langTabLink[data-lang="${inputContainer.dataset.language}"`);
    };
    /**
   * Init method executed on object instantiation
   * @return {void}
   */ (()=>{
        if (!inputContainer) return false;
        languageTab = this.getLanguageTab();
    })();
};
exports.default = FtLanguageTab;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"cXw5E":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldCKEditorInline", ()=>FtIsInputfieldCKEditorInline);
parcelHelpers.export(exports, "FtInputfieldCKEditorInline", ()=>FtInputfieldCKEditorInline);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfields = require("./FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Determines if a given inputfield contains an inline CKEditor instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */ const FtIsInputfieldCKEditorInline = (inputfield)=>!!inputfield.querySelector('.InputfieldCKEditorInline');
/**
 * Handles translations for CKEditor Inputfields
 * @return {object}  Public methods
 */ const FtInputfieldCKEditorInline = function(inputfield) {
    /**
   * Contains values for all fields/languages
   * Populated on FtInputfieldCKEditorInline instantiation
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {String} Inputfield content
   * @type {Object}
   */ const changedValues = {};
    /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type     {Object}
   */ const languageTabs = {};
    /**
   * Will contain all language input containers keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type {Object}
   */ const inputContainers = {};
    /**
   * Will contain all CKEditor instances
   * @property {String} ProcessWire Language ID
   * @value    {CKEditor|null}
   * @type     {Object}
   */ const editorInstances = {};
    /**
   * Will contain all elements that the inline editor uses for content
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const contentElements = {};
    /**
   * Will contain the base CKEditor instance ID that can be used to get the default CKEditor instance
   * using the CKEditor API, or another instance by modifying this one.
   * Set on FtInputfieldCKEditor instantiation
   * @type {?String}
   */ let defaultLanguageInstanceId = null;
    /**
   * Activity overlay object, set on instantiation
   *
   * @access public
   * @type {Object}
   */ let activityOverlay;
    /**
   * Gets existing or instantiates a new activity overlay
   *
   * @access public
   * @return {Object}
   */ this.getActivityOverlay = ()=>activityOverlay;
    /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @access public
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * Attempts to get the value for a language via the CKEditor API, falls back to directly getting
   * the content of the content element
   * @access public
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>{
        const ckeditorInstance = this.getEditorInstanceForLanguage(languageId);
        if (ckeditorInstance) return ckeditorInstance.getData();
        return this.getContentElementForLanguage(languageId).innerHTML;
    };
    /**
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const instance = this.getEditorInstanceForLanguage(languageId);
        const contentElement = this.getContentElementForLanguage(languageId);
        instance ? instance.setValue(value) : contentElement.innerHTML = value;
        contentElement.dispatchEvent(new Event('input'));
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and Admin listeners work
        $(contentElement).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * Attempts to get the CKEditor instance for a given language ID. This method should
   * be used exclusively to get instances as it also sets event listeners for content
   * changes if they have been instantiated after FtInputfieldCKEditor has loaded
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?CKEditor}
   */ this.getEditorInstanceForLanguage = (languageId)=>{
        if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) return editorInstances[languageId];
        editorInstances[languageId] = CKEDITOR.instances[this.createCKEditorSelector(languageId)];
        return editorInstances[languageId];
    };
    /**
   * Gets the content element that CKEditor uses to store the field content
   * Ensures memoization
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */ this.getContentElementForLanguage = (languageId)=>{
        if (Object.hasOwn(contentElements, languageId)) return contentElements[languageId];
        contentElements[languageId] = this.getInputContainerForLanguage(languageId).querySelector('.InputfieldCKEditorInlineEditor');
        return contentElements[languageId];
    };
    /**
   * Creates a CKEditor ID used to get instances by language
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {String}
   */ this.createCKEditorSelector = (languageId)=>{
        if (languageId == (0, _ftConfigDefault.default).getDefaultLanguage().id) return defaultLanguageInstanceId;
        return `${defaultLanguageInstanceId}__${languageId}`;
    };
    /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        if (Object.keys(inputContainers).length === (0, _ftConfigDefault.default).getLanguageCount()) return inputContainers;
        this.getSelf().querySelectorAll('[data-language]').forEach((el)=>{
            inputContainers[el.dataset.language] = el;
        });
        return inputContainers;
    };
    /**
   * Gets a specific input container
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */ this.getInputContainerForLanguage = (languageId)=>{
        if (Object.hasOwn(inputContainers, languageId)) return inputContainers[languageId];
        inputContainers[languageId] = inputfield.querySelector(`[data-language="${languageId}"]`);
        return inputContainers[languageId];
    };
    /**
   * @access private
   * @param  {Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    /**
   * Creates a MutationObserver that will detect when the content has changed for a given content
   * element. When content is changed, is will mock an 'input' even that an eventListener will
   * respond to
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerUpdateEvent = (languageId)=>{
        const contentElement = this.getContentElementForLanguage(languageId);
        new MutationObserver((mutations, observer)=>{
            for (let mutation of mutations)mutation.target.dispatchEvent(new Event('input'));
        }).observe(contentElement, {
            childList: true
        });
    };
    /**
   * Registers an event listener that will respond to any 'input' changes in a
   * content element
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerInputEventListener = (languageId)=>{
        this.getContentElementForLanguage(languageId).addEventListener('input', (e)=>{
            changedValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
        });
    };
    /**
   * Init on object instantiation
   * @access private
   * @return {Void}
   */ (()=>{
        if (CKEDITOR === undefined) {
            console.error('CKEditor was not found by Fluency, translation unavailable');
            return null;
        }
        const allInputContainers = this.getInputContainers();
        defaultLanguageInstanceId = Object.values(allInputContainers)[0].id.replace('langTab_', '');
        for(let languageId in allInputContainers){
            let inputContainer = allInputContainers[languageId];
            editorInstances[languageId] = this.getEditorInstanceForLanguage(languageId);
            languageTabs[languageId] = new (0, _ftLanguageTabDefault.default)(inputContainer);
            this.registerInputEventListener(languageId);
        }
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers);
    })();
};

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","./FtInputfields":"6uJdZ","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"2PBQw":[function(require,module,exports,__globalThis) {
/**
 * Determines if a given inputfield contains a Table instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldTable", ()=>FtIsInputfieldTable);
const FtIsInputfieldTable = (inputfield)=>isInputfieldTable(inputfield) || isInputfieldTableRow(inputfield);
/**
 * Handles table inputfields on load
 * @param  {Element} inputfield
 * @return {Bool}
 */ const isInputfieldTable = (inputfield)=>!!inputfield.classList.contains('InputfieldTable');
const isInputfieldTableRow = (inputfield)=>(inputfield.tagName, false);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"fbcvo":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldText", ()=>FtIsInputfieldText);
parcelHelpers.export(exports, "FtInputfieldText", ()=>FtInputfieldText);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfields = require("./FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Determines if the current inputfield is an InputfieldText
 * @param  {Element} inputfield Element containing the multilanguage fields
 * @return {Bool}
 */ const FtIsInputfieldText = (inputfield)=>!!inputfield.querySelector("input[type='text']");
/**
 * Handles IO operations for a multilanguage InputfieldText element
 * Language IDs are always converted to int to accept values from all sources since some may be
 * retrieved from various sources as a string
 * @param {Element} inputfield The Inputfield .hasLangTabs container
 */ const FtInputfieldText = function(inputfield) {
    /**
   * Page-load values for all fields/languages
   * Populated on object instantiation
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when content is modified
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const changedValues = {};
    /**
   * FtLanguageTab objects for each language
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const languageTabs = {};
    /**
   * Will contain all elements containing language inputs
   * @property {String} ProcessWire Language ID
   * @type {NodeList}
   */ const inputContainers = {};
    /**
   * Text input fields
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const languageFields = {};
    /**
   * Activity overlay object, set on instantiation
   *
   * @access public
   * @type {Object}
   */ let activityOverlay;
    /*
   * @access public
   * @return {Object}
   */ this.getActivityOverlay = ()=>activityOverlay;
    /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @access public
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * @access public
   * @param  {String|Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>this.getFieldForLanguage(languageId).value;
    /**
   * @access public
   * @param  {String|Int} languageId ProcessWire language ID
   * @param  {Mixed}      value      Value to insert into field
   * @return {Bool}                  Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const field = this.getFieldForLanguage(languageId);
        (0, _ftInputfieldsDefault.default).updateValue(field, value);
        // Required to programmatically trigger the event listener for this field
        field.dispatchEvent(new Event('keyup'));
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and Admin listeners work
        $(field).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * @access private
   * @param  {String|Int}  languageId ProcessWire language ID
   * @return {Element}                Text field
   */ this.getFieldForLanguage = (languageId)=>{
        if (Object.hasOwn(languageFields, languageId) && !!languageFields[languageId]) return languageFields[languageId];
        languageFields[languageId] = this.getInputContainerForLanguage(languageId).querySelector('input');
        return languageFields[languageId];
    };
    /**
   * Gets a specific input container
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */ this.getInputContainerForLanguage = (languageId)=>{
        if (Object.hasOwn(inputContainers, languageId) && !!inputContainers[languageId]) return inputContainers[languageId];
        inputContainers[languageId] = inputfield.querySelector(`[data-language="${languageId}"]`);
        return inputContainers[languageId];
    };
    /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        inputfield.querySelectorAll('[data-language]').forEach((el)=>inputContainers[el.dataset.language] = el);
        return inputContainers;
    };
    /**
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    /**
   * Registers the event listener that watches for changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerInputEventListener = (languageId)=>{
        this.getFieldForLanguage(languageId).addEventListener('keyup', (e)=>{
            changedValues[languageId] = e.target.value;
            languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
        });
    };
    /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */ (()=>{
        const allInputContainers = this.getInputContainers();
        for(let languageId in allInputContainers){
            let inputContainer = allInputContainers[languageId];
            initValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId] = new (0, _ftLanguageTabDefault.default)(inputContainer);
            this.registerInputEventListener(languageId);
        }
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers);
    })();
};

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","./FtInputfields":"6uJdZ","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"cQV0O":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldTextarea", ()=>FtIsInputfieldTextarea);
parcelHelpers.export(exports, "FtInputfieldTextarea", ()=>FtInputfieldTextarea);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfields = require("./FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Determines if the current inputfield is an InputfieldText
 * @param  {Element} inputfield Element containing the multilanguage fields
 * @return {Bool}
 */ const FtIsInputfieldTextarea = (inputfield)=>!!inputfield.querySelector('textarea:not(.InputfieldCKEditorNormal,.InputfieldTinyMCEEditor)');
/**
 * Handles IO operations for a multilanguage InputfieldText element
 * Language IDs are always converted to int to accept values from all sources since some may be
 * retrieved from various sources as a string
 * @param {Element} inputfield The Inputfield .hasLangTabs container
 */ const FtInputfieldTextarea = function(inputfield) {
    /**
   * Contains values for all fields/languages keyed by ProcessWire language ID.
   * Populated on object instantiation
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @type {Object}
   */ const changedValues = {};
    /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * Language ID keys are integers
   * @type {Object}
   */ const languageTabs = {};
    /**
   * Will contain all language input containers keyed by language ID
   * Language ID keys are integers
   * @type {NodeList}
   */ const inputContainers = {};
    /**
   * Will contain all language input text fields keyed by language ID
   * @type {Object}
   */ const languageFields = {};
    /**
   * Activity overlay object, set on instantiation
   *
   * @access public
   * @type {Object}
   */ let activityOverlay;
    /*
   * @access public
   * @return {Object}
   */ this.getActivityOverlay = ()=>activityOverlay;
    /**
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>this.getFieldForLanguage(languageId).value;
    /**
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const field = this.getFieldForLanguage(languageId);
        (0, _ftInputfieldsDefault.default).updateValue(field, value);
        // Required to programmatically trigger the event listener for this field
        field.dispatchEvent(new Event('keyup'));
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and admin JS listeners work
        $(field).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * @param  {Int}    languageId ProcessWire language ID
   * @return {Element}           Text field
   */ this.getFieldForLanguage = (languageId)=>{
        if (Object.hasOwn(languageFields, languageId)) return languageFields[languageId];
        languageFields[languageId] = inputfield.querySelector(`[data-language="${languageId}"] textarea`);
        return languageFields[languageId];
    };
    /**
   * Get all input containers where content is entered, memoizes
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        inputfield.querySelectorAll('[data-language]').forEach((el)=>{
            inputContainers[el.dataset.language] = el;
        });
        return inputContainers;
    };
    /**
   * @param  {Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    /**
   * Registers the event listener that watches for changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerInputEventListener = (languageId)=>{
        this.getFieldForLanguage(languageId).addEventListener('keyup', (e)=>{
            changedValues[languageId] = e.target.value;
            languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
        });
    };
    /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */ (()=>{
        const allInputContainers = this.getInputContainers();
        for(let languageId in allInputContainers){
            let inputContainer = allInputContainers[languageId];
            initValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId] = new (0, _ftLanguageTabDefault.default)(inputContainer);
            this.registerInputEventListener(languageId);
        }
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers);
    })();
};

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","./FtInputfields":"6uJdZ","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"9u4MI":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldTinyMCE", ()=>FtIsInputfieldTinyMCE);
parcelHelpers.export(exports, "FtInputfieldTinyMCE", ()=>FtInputfieldTinyMCE);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfields = require("./FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Determines if a given inputfield contains a regular TinyMCE instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */ const FtIsInputfieldTinyMCE = (inputfield)=>!!inputfield.querySelector('.InputfieldTinyMCENormal');
/**
 * Handles IO operations for a multilanguage InputfieldTinyMCE elements
 * @param {Element} inputfield The Inputfield .hasLangTabs container
 */ const FtInputfieldTinyMCE = function(inputfield) {
    /**
   * Contains values for all fields/languages keyed by ProcessWire language ID.
   * Populated on object instantiation
   *
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {String} Inputfield content
   * @type {Object}
   */ const changedValues = {};
    /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type     {Object}
   */ const languageTabs = {};
    /**
   * Will contain all language input containers keyed by language ID
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type {Object}
   */ const inputContainers = {};
    /**
   * Will contain all language input textarea fields that hold Inputfield data before TinyMCE
   * instances are initialized.
   * @property {String} ProcessWire Language ID
   * @value    {Element}
   * @type     {Object}
   */ const textareas = {};
    /**
   * Will contain all TinyMCE instances as they become available (are initialized). Most TinyMCE
   * instances are lazy loaded or loaded on demand. Keyed by language ID
   * This is populated on FtInputfieldTinyMCE on instantiation and language ID properties will either
   * have a TinyMCE object or null
   * @property {String} ProcessWire Language ID
   * @value    {TinyMCE|null}
   * @type     {Object}
   */ const editorInstances = {};
    /**
   * Will contain the base TinyMCE instance ID that can be used to get the default TinyMCE instance
   * using the TinyMCE API, or another instance by modifying this one.
   * Set on FtInputfieldTinyMCE instantiation
   * @type {?String}
   */ let defaultLanguageInstanceId = null;
    /**
   * Activity overlay object, set on instantiation
   *
   * @access public
   * @type {Object}
   */ let activityOverlay;
    /*
   * @access public
   * @return {Object}
   */ this.getActivityOverlay = ()=>activityOverlay;
    /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @access public
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>{
        const tinymceInstance = this.getTinymceInstanceForLanguage(languageId);
        if (tinymceInstance) return tinymceInstance.getContent();
        return this.getTextareaForLanguage(languageId).value;
    };
    /**
   * Sets content for a language, will set the value for TinyMCE if it exists, and always set the
   * value for the textarea
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const tinymceInstance = this.getTinymceInstanceForLanguage(languageId);
        if (tinymceInstance) {
            tinymceInstance.setContent(value);
            tinymceInstance.fire('input');
        }
        const field = this.getTextareaForLanguage(languageId);
        (0, _ftInputfieldsDefault.default).updateValue(field, value);
        field.dispatchEvent(new Event('input'));
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and Admin listeners work
        $(field).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * Attempts to get the TinyMCE instance for a given language ID if it exists
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?TinyMCE}
   */ this.getTinymceInstanceForLanguage = (languageId)=>{
        if (Object.hasOwn(editorInstances, languageId) && editorInstances[languageId]) return editorInstances[languageId];
        const tinymceSelector = this.createTinymceSelector(languageId);
        editorInstances[languageId] = tinymce.get(tinymceSelector);
        return editorInstances[languageId];
    };
    /**
   * @access private
   * @param  {Int}    languageId ProcessWire language ID
   * @return {Element}           Text field
   */ this.getTextareaForLanguage = (languageId)=>{
        if (Object.hasOwn(textareas, languageId) && !!textareas[languageId]) return textareas[languageId];
        textareas[languageId] = this.getSelf().querySelector(`[data-language="${languageId}"] textarea`);
        return textareas[languageId];
    };
    /**
   * Get all input containers holding TinyMCE instances, memoizes. Keyed by ID
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        this.getSelf().querySelectorAll('[data-language]').forEach((el)=>{
            inputContainers[el.dataset.language] = el;
        });
        return inputContainers;
    };
    /**
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    /**
   * Creates a TinyMCE ID used to get instances by language
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {String}
   */ this.createTinymceSelector = (languageId)=>{
        if (languageId == (0, _ftConfigDefault.default).getDefaultLanguage().id) return defaultLanguageInstanceId;
        return `${defaultLanguageInstanceId}__${languageId}`;
    };
    /**
   * Bind Inputfield required events to a TinyMCE instance
   * @access private
   * @param  {String|Int} languageId      ProcessWire language ID
   * @param  {Object}     tinymceInstance TinyMCE object
   * @return {Void}
   */ this.bindTinymceEvents = (languageId, tinymceInstance)=>{
        tinymceInstance.on('keyup', (e)=>this.getTextareaForLanguage(languageId).dispatchEvent(new Event('input')));
    };
    /**
   * Creates an observer that looks for new TinyMCE instances within this Inputfield
   * @access private
   * @return {void}
   */ this.initTinymceInstanceOnCreation = (languageId, inputContainer)=>{
        new MutationObserver((mutations, observer)=>{
            for (let mutation of mutations){
                let targetEl = mutation.target;
                if (targetEl.dataset.language == languageId) {
                    editorInstances[languageId] = this.getTinymceInstanceForLanguage(languageId);
                    this.bindTinymceEvents(languageId, editorInstances[languageId]);
                    if (editorInstances[languageId]) observer.disconnect();
                }
            }
        }).observe(inputContainer, {
            childList: true
        });
    };
    /**
   * Registers the event listener that watches for content changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {void}
   */ this.registerInputEventListener = (languageId)=>{
        textareas[languageId].addEventListener('input', (e)=>{
            changedValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
        });
    };
    /**
   * Initializes FtInputfieldTinyMCE Inputfield
   * @access private
   * @param  {Array<Element>} allInputContainers All elements containing TinyMCE fields
   * @return {Void}
   */ this.initAll = (allInputContainers)=>{
        // TinyMCE instances are initialzied using a field ID. The default language element contains
        // an ID substring that can be modified to create a TinyMCE ID string that can be used to get
        // TinyMCE instances
        defaultLanguageInstanceId = Object.values(allInputContainers)[0].id.replace('langTab_', '');
        // At runtime/initialization only the TinyMCE instance will load for the default language, others
        // will be loaded when switched to the tab. Still attempt to get all TinyMCE instances for all
        // tabs in case they are available
        for(let languageId in allInputContainers){
            const inputContainer = allInputContainers[languageId];
            // Get initial content on page load
            // Call this first to ensure getValueForLanguage() pulls from the textarea element rather than
            // attempting to use the TinyMCE API on object instantiation
            initValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId] = new (0, _ftLanguageTabDefault.default)(inputContainer);
            editorInstances[languageId] = this.getTinymceInstanceForLanguage(languageId);
            textareas[languageId] = this.getTextareaForLanguage(languageId);
            this.registerInputEventListener(languageId);
            // If there was no editor found at initialization, register when created
            if (!editorInstances[languageId]) this.initTinymceInstanceOnCreation(languageId, inputContainer);
        }
        // Bind TinyMCE event listeners to any TinyMCE input fields found on initialization
        for(let languageId in editorInstances)if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) this.bindTinymceEvents(languageId, editorInstances[languageId]);
    };
    /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */ (()=>{
        const allInputContainers = this.getInputContainers();
        // Set a micro timeout to allow TinyMCE instances to instantiate.
        // This is especially important when new fields are dynamically added after page load
        setTimeout(()=>{
            this.initAll(allInputContainers);
        }, 50);
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers);
    })();
};

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","./FtInputfields":"6uJdZ","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"95dR0":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FtIsInputfieldTinyMCEInline", ()=>FtIsInputfieldTinyMCEInline);
parcelHelpers.export(exports, "FtInputfieldTinyMCEInline", ()=>FtInputfieldTinyMCEInline);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfields = require("./FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Determines if a given inputfield contains an inline TinyMCE instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */ const FtIsInputfieldTinyMCEInline = (inputfield)=>!!inputfield.querySelector('.InputfieldTinyMCEInline');
/**
 * Handles translations for TinyMCE Inputfields
 * @return {object}  Public methods
 */ const FtInputfieldTinyMCEInline = function(inputfield) {
    /**
   * Contains values for all fields/languages keyed by ProcessWire language ID.
   * Populated on object instantiation
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when they change keyed by language ID
   * @type {Object}
   */ const changedValues = {};
    /**
   * Will contain FtLanguageTab object for each language keyed by language ID
   * Language ID keys are integers
   * @type {Object}
   */ const languageTabs = {};
    /**
   * Will contain all language input containers keyed by language ID
   * Language ID keys are integers
   * @type {NodeList}
   */ const inputContainers = {};
    /**
   * Will contain all the HTML elements that the inline TinyMCE editor stores/modifies content
   * keyed by language ID
   * @type {Object}
   */ const contentElements = {};
    /**
   * Will contain all TinyMCE instances as they become available
   * @type {Object}
   */ const editorInstances = {};
    /**
   * Will contain the TinyMCE instance name for the default language.
   * Used to get the TinyMCE instance
   * @type {?String}
   */ let defaultLanguageInstanceId = null;
    /**
   * @access public
   * @type {Object}
   */ let activityOverlay;
    /*
   * @access public
   * @return {Object}
   */ this.getActivityOverlay = ()=>activityOverlay;
    /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @access public
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * @access public
   * @param  {Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>{
        const tinymceInstance = this.getEditorInstanceForLanguage(languageId);
        if (tinymceInstance) return tinymceInstance.getContent();
        return this.getContentElementForLanguage(languageId).innerHTML;
    };
    /**
   * @access public
   * @param  {Int}    languageId ProcessWire language ID
   * @param  {Mixed}  value      Value to insert into field
   * @return {Bool}              Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const contentElement = this.getContentElementForLanguage(languageId);
        // Click event ensures that TinyMCE has been initialized before inserting content
        contentElement.click();
        contentElement.innerHTML = value;
        // Required to programmatically trigger the event listener for this field
        contentElement.dispatchEvent(new Event('input'));
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and Admin listeners work
        $(contentElement).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * Attempts to get the TinyMCE instance for a given language ID if it exists
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {?TinyMCE}
   */ this.getEditorInstanceForLanguage = (languageId)=>{
        if (Object.hasOwn(editorInstances, languageId) && !!editorInstances[languageId]) return editorInstances[languageId];
        const tinymceSelector = this.createTinymceSelector(languageId);
        editorInstances[languageId] = tinymce.get(tinymceSelector);
        return editorInstances[languageId];
    };
    /**
   * Gets the content element that TinyMCE uses to store the field content
   * Ensures memoization
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */ this.getContentElementForLanguage = (languageId)=>{
        if (Object.hasOwn(contentElements, languageId)) return contentElements[languageId];
        contentElements[languageId] = this.getInputContainerForLanguage(languageId).querySelector('.mce-content-body');
        return contentElements[languageId];
    };
    /**
   * Gets a specific input container. Memoizes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */ this.getInputContainerForLanguage = (languageId)=>{
        if (Object.hasOwn(inputContainers, languageId) && !!inputContainers[languageId]) return inputContainers[languageId];
        inputContainers[languageId] = this.getSelf().querySelector(`[data-language="${languageId}"]`);
        return inputContainers[languageId];
    };
    /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        this.getSelf().querySelectorAll('[data-language]').forEach((el)=>{
            inputContainers[el.dataset.language] = el;
        });
        return inputContainers;
    };
    /**
   * Determines if the content for a given langauge has changed. In some instances TinyMCE
   * inserts unwanted elements into empty fields that will always register content as having been
   * changed. This includes adding elements to fields that may be returned to their original content
   * matching content at page load. These "phantom elements" must be checked for.
   * @access private
   * @param  {Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    /**
   * Creates a TinyMCE ID used to get instances by language
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {String}
   */ this.createTinymceSelector = (languageId)=>{
        if (languageId == (0, _ftConfigDefault.default).getDefaultLanguage().id) return defaultLanguageInstanceId;
        return `${defaultLanguageInstanceId}__${languageId}`;
    };
    /**
   * Creates a MutationObserver that will detect when the innerHTML content has changed for a given
   * content element. When content is changed, it will mock an 'input' event that an eventListener
   * can respond to
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerUpdateEvent = (languageId)=>{
        const contentElement = this.getContentElementForLanguage(languageId);
        new MutationObserver((mutations, observer)=>{
            for (let mutation of mutations)mutation.target.dispatchEvent(new Event('input'));
        }).observe(contentElement, {
            childList: true
        });
    };
    /**
   * Register an input observer
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerInputEventListener = (languageId)=>{
        this.getContentElementForLanguage(languageId).addEventListener('input', (e)=>{
            changedValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId].setModifiedState(this.contentHasChanged(languageId));
        });
    };
    /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */ (()=>{
        if (tinymce === undefined) {
            console.error('TinyMCE was not found by Fluency, translation unavailable');
            return null;
        }
        const allInputContainers = this.getInputContainers();
        // TinyMCE instances are initialzied using a field ID. The default language element contains
        // an ID substring that can be modified to create a TinyMCE ID string that can be used to get
        // TinyMCE instances
        defaultLanguageInstanceId = Object.values(allInputContainers)[0].id.replace('langTab_', '');
        for(let languageId in allInputContainers){
            let inputContainer = allInputContainers[languageId];
            initValues[languageId] = this.getValueForLanguage(languageId);
            languageTabs[languageId] = new (0, _ftLanguageTabDefault.default)(inputContainer);
            this.registerUpdateEvent(languageId);
            this.registerInputEventListener(languageId);
        }
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers);
    })();
};

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","./FtInputfields":"6uJdZ","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"bgpdx":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _ftActivityOverlay = require("../ui/FtActivityOverlay");
var _ftActivityOverlayDefault = parcelHelpers.interopDefault(_ftActivityOverlay);
var _ftConfig = require("../global/FtConfig");
var _ftConfigDefault = parcelHelpers.interopDefault(_ftConfig);
var _ftInputfields = require("./FtInputfields");
var _ftInputfieldsDefault = parcelHelpers.interopDefault(_ftInputfields);
var _ftInputfieldTranslateButton = require("../ui/FtInputfieldTranslateButton");
var _ftInputfieldTranslateButtonDefault = parcelHelpers.interopDefault(_ftInputfieldTranslateButton);
var _ftLanguageTab = require("../ui/FtLanguageTab");
var _ftLanguageTabDefault = parcelHelpers.interopDefault(_ftLanguageTab);
/**
 * Handles IO operations for a multilanguage InputfieldPageName element
 * The InputfieldPageName element has special considerations compared to other fields as they do not
 * have the same markup structure.
 * Some actions are internalized here, such as
 * @param {Element} inputfield The Inputfield .InputfieldPageName container
 */ const FtInputfieldPageName = function(inputfield) {
    /**
   * Page-load values for all fields/languages
   * Populated on object instantiation
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const initValues = {};
    /**
   * Will contain new values for fields/languages when content is modified
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const changedValues = {};
    /**
   * FtLanguageTab objects for each language
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const languageTabs = {};
    /**
   * Will contain all elements containing language inputs
   * @property {String} ProcessWire Language ID
   * @type {NodeList}
   */ const inputContainers = {};
    /**
   * Text input fields
   * @property {String} ProcessWire Language ID
   * @type {Object}
   */ const languageFields = {};
    let contentModifiedClass = new (0, _ftLanguageTabDefault.default)().getContentModifiedClass();
    /**
   * Activity overlays by language IDs
   * @access public
   * @type {Object}
   */ let activityOverlays = {};
    /*
   * Return null to signal that the overlay should be by language ID
   *
   * @access public
   * @return {Object|Null}
   */ this.getActivityOverlay = (languageId)=>{
        if (!languageId) return null;
        return activityOverlays[languageId].getActivityOverlay();
    };
    /**
   * @access public
   * @return {Element} Inputfield element passed to this object on creation
   */ this.getSelf = ()=>inputfield;
    /**
   * @access public
   * @return {Mixed}
   */ this.getValueForDefaultLanguage = ()=>this.getValueForLanguage((0, _ftConfigDefault.default).getDefaultLanguage().id);
    /**
   * @access public
   * @param  {String|Int}   languageId ProcessWire language ID
   * @return {Mixed}
   */ this.getValueForLanguage = (languageId)=>this.getFieldForLanguage(languageId).value;
    /**
   * @access public
   * @param  {String|Int} languageId ProcessWire language ID
   * @param  {Mixed}      value      Value to insert into field
   * @return {Bool}                  Content is different from page load value
   */ this.setValueForLanguage = (languageId, value)=>{
        const field = this.getFieldForLanguage(languageId);
        (0, _ftInputfieldsDefault.default).updateValue(field, value);
        // Required to programmatically trigger the event listener for this field
        field.dispatchEvent(new Event('keyup'));
        // Vanilla JS events are not visible to jQuery and vice-versa. Trigger this so that other
        // modules and Admin listeners work
        $(field).trigger('change');
        return this.contentHasChanged(languageId);
    };
    /**
   * @access private
   * @param  {String|Int}  languageId ProcessWire language ID
   * @return {Element}                Text field
   */ this.getFieldForLanguage = (languageId)=>{
        if (Object.hasOwn(languageFields, languageId) && !!languageFields[languageId]) return languageFields[languageId];
        languageFields[languageId] = this.getInputContainerForLanguage(languageId).querySelector('input');
        return languageFields[languageId];
    };
    /**
   * Gets a specific input container
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Element}
   */ this.getInputContainerForLanguage = (languageId)=>{
        if (!Object.hasOwn(inputContainers, languageId) && !inputContainers[languageId]) this.getInputContainers();
        return inputContainers[languageId];
    };
    /**
   * Get all input containers where content is entered, memoizes
   * @access private
   * @return {Object} All languages keyed by (int) language ID
   */ this.getInputContainers = ()=>{
        // Page name fields require querying the child input and determining the language by analyzing
        // the name attribute of the text input itself
        this.getSelf().querySelectorAll('.LanguageSupport').forEach((el)=>{
            // The default language input has no language ID, it's the default language, so fallback
            const languageId = el.querySelector('input[type=text]').name.replace('_pw_page_name', '') || (0, _ftConfigDefault.default).getDefaultLanguage().id;
            inputContainers[languageId] = el;
        });
        return inputContainers;
    };
    /**
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Bool}
   */ this.contentHasChanged = (languageId)=>Object.hasOwn(changedValues, languageId) && changedValues[languageId] !== initValues[languageId];
    this.setModifiedState = (languageId, contentHasChanged)=>{
        const inputContainer = this.getInputContainerForLanguage(languageId);
        if (contentHasChanged) inputContainer.classList.add(contentModifiedClass);
        if (!contentHasChanged) inputContainer.classList.remove(contentModifiedClass);
    };
    /**
   * Registers the event listener that watches for changes
   * @access private
   * @param  {String|Int} languageId ProcessWire language ID
   * @return {Void}
   */ this.registerInputEventListener = (languageId)=>{
        this.getFieldForLanguage(languageId).addEventListener('keyup', (e)=>{
            changedValues[languageId] = e.target.value;
            this.setModifiedState(languageId, this.contentHasChanged(languageId));
        });
    };
    /**
   * Init method executed on object instantiation
   * - Stores initial field values for each langauge
   * - Creates/stores an FtLanguageTab object for each language
   * - Binds an event that detects changes on input
   * @return {Void}
   */ (()=>{
        const allInputContainers = this.getInputContainers();
        for(let languageId in allInputContainers){
            let inputContainer = allInputContainers[languageId];
            initValues[languageId] = this.getValueForLanguage(languageId);
            activityOverlays[languageId] = new createActivityOverlay(inputContainer);
            this.registerInputEventListener(languageId);
        }
        new (0, _ftInputfieldTranslateButtonDefault.default)(this, allInputContainers, true);
    })();
};
const createActivityOverlay = function(languageInput) {
    let activityOverlay;
    this.getSelf = ()=>languageInput;
    this.getActivityOverlay = ()=>activityOverlay;
    (()=>{
        activityOverlay = new (0, _ftActivityOverlayDefault.default)(this);
    })();
};
exports.default = FtInputfieldPageName;

},{"../ui/FtActivityOverlay":"6pheB","../global/FtConfig":"6zv3w","./FtInputfields":"6uJdZ","../ui/FtInputfieldTranslateButton":"1qPYB","../ui/FtLanguageTab":"iH796","@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}],"co4Kc":[function(require,module,exports,__globalThis) {
/**
 * Handles modifying the Fluency menu item
 * @return {object} Public methods
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const FtAdminMenu = function() {
    /**
   * Initializes module
   * @return {void}
   */ const init = ()=>{
        convertFtAdminMenuToModal();
    };
    /**
   * Finds and converts the Translation admin menu item to open in a modal
   * rather than navigating to the page.
   * @return {void}
   */ const convertFtAdminMenuToModal = ()=>{
        const adminNavItems = document.querySelectorAll('.pw-masthead .pw-primary-nav > li > a'), urlParams = new URLSearchParams(window.location.search);
        // We don't want to modify this menu item if we are on the Fluency config page
        // because the modal behavior is not available
        if (urlParams.get('name') === 'Fluency') return false;
        adminNavItems.forEach((el, i)=>{
            let hrefSegments = el.href.split('/').filter(Boolean);
            if (hrefSegments[hrefSegments.length - 1].includes('fluency')) {
                el.href = el.href + '?modal=1';
                el.classList.add('pw-modal-large');
                el.classList.add('pw-modal');
            }
        });
    };
    return {
        init: init
    };
}();
exports.default = FtAdminMenu;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5oERU"}]},["fWsaf"], "fWsaf", "parcelRequiree003", {})

//# sourceMappingURL=fluency.js.map
