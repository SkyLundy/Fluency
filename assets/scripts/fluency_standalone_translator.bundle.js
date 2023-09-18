!function a(i,s,r){function o(e,t){if(!s[e]){if(!i[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(l)return l(e,!0);throw(t=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",t}n=s[e]={exports:{}},i[e][0].call(n.exports,function(t){return o(i[e][1][t]||t)},n,n.exports,a,i,s,r)}return s[e].exports}for(var l="function"==typeof require&&require,t=0;t<r.length;t++)o(r[t]);return o}({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var c=a(t("../global/Fluency")),u=a(t("../global/FtConfig")),d=a(t("../ui/FtActivityOverlay"));function a(t){return t&&t.__esModule?t:{default:t}}t=function(){const t="data-ft-initialized";return{initializedAttr:t,init:()=>{[...document.querySelectorAll(`.ft-standalone-translator:not([${t}])`)].forEach(t=>{new i(t)})}}}();const i=function(t){let a,i,s,r,o,n=u.default.getUiTextFor("standaloneTranslator");const l={sourceLanguageSelect:"ft-source-language",targetLanguageSelect:"ft-target-language",sourceContentInputfield:"ft-source-content",translatedContentInputfield:"ft-translated-content",translateButton:"js-ft-translate",copyButton:"ft-click-to-copy"};this.cacheInputs=()=>{l.translateButton=t.querySelector("."+l.translateButton),l.sourceLanguageSelect=t.querySelector("."+l.sourceLanguageSelect).closest("li.Inputfield"),l.targetLanguageSelect=t.querySelector("."+l.targetLanguageSelect).closest("li.Inputfield"),l.sourceContentInputfield=t.querySelector("."+l.sourceContentInputfield).closest("li.Inputfield"),l.translatedContentInputfield=t.querySelector("."+l.translatedContentInputfield).closest("li.Inputfield")},this.getSelf=()=>t,this.bindTranslateButton=()=>{l.translateButton.addEventListener("click",t=>{t.preventDefault();var t=r.getValue(),e=o.getValue(),n=i.getContent();t||r.indicateError(),e||o.indicateError(),n||i.indicateError(),t&&e&&n&&(a.showActivity(),c.default.getTranslation(t,e,n).then(t=>{t.error&&a.showError(t.message),s.setContent(t.translations[0]),a.hide()}))})},this.addCopyContentButton=()=>{var t=l.copyButton,e=(l.copyButton=document.createElement("button"),l.copyButton.setAttribute("class",t),l.copyButton.innerText=n.clickToCopy,document.createElement("i")),e=(e.setAttribute("class","ft-copy-icon fa fa-fw fa-clone"),l.copyButton.appendChild(e),l.translatedContentInputfield.querySelector(".InputfieldHeader"));e.classList.add(t+"-container"),e.appendChild(l.copyButton),this.bindCopyContentButton()},this.bindCopyContentButton=()=>{l.copyButton.addEventListener("click",t=>{t.preventDefault();t=s.getContent();t&&navigator.clipboard.writeText(t).then(()=>{s.indicateSuccess(n.copied)})})},this.toggleCopyContentButton=t=>{t?l.copyButton.classList.add("visible"):l.copyButton.classList.remove("visible")},this.createInputControllers=()=>{r=new g(l.sourceLanguageSelect),o=new g(l.targetLanguageSelect),i=new v(l.sourceContentInputfield),s=new v(l.translatedContentInputfield,this.toggleCopyContentButton)},this.cacheInputs(),this.createInputControllers(),a=new d.default(this),this.addCopyContentButton(),this.bindTranslateButton()},g=function(t){let e,n;this.getSelf=()=>t,this.getValue=()=>n.value,this.indicateError=()=>e.flashError("",300),n=t.querySelector("select"),e=new d.default(this)},v=function(t){let e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;u.default.getUiTextFor("standaloneTranslator");let n;let a;this.getSelf=()=>t,this.getContent=()=>n.get(),this.setContent=t=>{n.set(t)},this.indicateError=()=>a.flashError("",300),this.indicateSuccess=t=>a.flashSuccess(t),n=new s(t,e),a=new d.default(this)},s=function(t){let e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,n,a=!1;this.set=t=>{n.value=t,n.dispatchEvent(new Event("input"))},this.get=()=>n.value,this.bindContentChangeListener=()=>{n.addEventListener("input",t=>{t=t.target.value;t&&!a&&(a=!0,e(!0)),!t&&a&&(a=!1,e(!1))})},n=t.querySelector("textarea"),e&&this.bindContentChangeListener()};n.default=t},{"../global/Fluency":3,"../global/FtConfig":4,"../ui/FtActivityOverlay":5}],2:[function(t,e,n){"use strict";var a=(t=t("./components/FtStandaloneTranslatorFieldset"))&&t.__esModule?t:{default:t};window.addEventListener("load",t=>{a.default.init()})},{"./components/FtStandaloneTranslatorFieldset":1}],3:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var c=(t=t("./FtConfig"))&&t.__esModule?t:{default:t};t=function(){const n=c.default.getUiTextFor("errors");const r=t=>{var e={"X-Requested-With":"XMLHttpRequest"};return"GET"===t&&(e.Accept="application/json"),"POST"===t&&(e["Content-Type"]="application/json"),e},t=(t,e)=>fetch(t,{method:"GET",cache:"no-store",headers:r("GET")}).then(o).then(e).catch(l),e=(t,e)=>fetch(t,{method:"DELETE",headers:r("GET")}).then(o).then(e).catch(l),o=t=>{if(204===t.status)return t;if(t.ok)return t.json();throw new Error},l=t=>{console.error("[Fluency module API failure]",t.message);var e={error:null,message:null};return"NetworkError"===t.message.split(" ")[0]?(e.error="FLUENCY_CLIENT_DISCONNECTED",e.message=n.FLUENCY_CLIENT_DISCONNECTED):(e.error="UNKNOWN_ERROR",e.message=n.UNKNOWN_ERROR),e};return{deleteTranslatableLanguagesCache:()=>e(c.default.getApiEndpointFor("translatableLanguagesCache"),t=>t),deleteTranslationCache:()=>e(c.default.getApiEndpointFor("translationCache"),t=>t),getAvailableLanguages:()=>t(c.default.getApiEndpointFor("languages"),t=>t),getTranslation:function(t,e,n){var a,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:[],s=4<arguments.length&&void 0!==arguments[4]?arguments[4]:null;return a=c.default.getApiEndpointFor("translation"),t={sourceLanguage:t,targetLanguage:e,content:n,options:i,caching:s},e=t=>t,fetch(a,{method:"POST",cache:"no-store",headers:r,body:JSON.stringify(t)}).then(o).then(e).catch(l)},getUsage:()=>t(c.default.getApiEndpointFor("usage"),t=>t)}}();n.default=t},{"./FtConfig":4}],4:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=function(){const t=ProcessWire.config.fluency;var e=t.localization;const n={activityOverlay:e.activityOverlay,languageSelect:e.languageSelect,inputfieldTranslateButtons:e.inputfieldTranslateButtons,standaloneTranslator:e.standaloneTranslator,usage:e.usage,errors:e.errors},a={languages:t.apiEndpoints.languages,translatableLanguagesCache:t.apiEndpoints.translatableLanguagesCache,test:t.apiEndpoints.test,translation:t.apiEndpoints.translation,translationCache:t.apiEndpoints.translationCache,usage:t.apiEndpoints.usage},i=t.configuredLanguages,s=t.unconfiguredLanguages;const r=()=>i;const o=()=>s;const l=()=>t.engine;return{fieldInitializedAttr:"data-ft-initialized",getApiEndpointFor:t=>a[t],getConfiguredLanguages:r,getDefaultLanguage:()=>i.reduce((t,e)=>e.default?e:t,null),getEngineInfo:l,getEngineProvidesUsageData:()=>l().providesUsageData,getLanguageCount:()=>i.length+s.length,getLanguageForId:n=>(n=parseInt(n,10),i.reduce((t,e)=>e.id===n?e:t,null)),getUiTextFor:t=>n[t],getUnconfiguredLanguages:o,languageIsTranslatable:t=>!s.includes(parseInt(t,10)),moduleShouldInitialize:()=>1<i.length}}();n.default=a},{}],5:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=(t=t("../global/FtConfig"))&&t.__esModule?t:{default:t};n.default=function(t){var n=this;let a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"translating";const i={parent:"ft-activity-overlay-container",overlay:"ft-activity-overlay",error:"error",message:"message",flash:"flash",success:"success",activity:"activity",visible:"visible",activityContainer:"ft-activity",activityStaticText:"ft-activity-text",activityAnimationContainer:"ft-activity-animation-container",activityAnimationItem:"ft-activity-animation-item",messageContainer:"ft-activity-message"};let e,s,r;this.showActivity=()=>{this.setActivityActive(),this.setOverlayVisible()},this.showMessage=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:5e3;n.setMessageContent(t),n.setActivityInactive(),n.setMessageActive(),n.setOverlayVisible(),n.hide(e)},this.flashSuccess=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:500;n.setSuccessActive(),n.setFlashActive(),n.showMessage(t,e)},this.flashError=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:500;n.setFlashActive(),n.setErrorActive(),n.showMessage(t,e)},this.showError=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:7e3;n.setErrorActive(),n.showMessage(t,e)},this.hide=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;setTimeout(()=>{n.setOverlayInvisible()},t),setTimeout(()=>{n.setActivityInactive(),n.setMessageInactive(),n.setErrorInactive(),n.setFlashInactive(),n.setMessageContent("")},t+500)},this.setActivityActive=()=>{e.classList.add(i.activity)},this.setActivityInactive=()=>{e.classList.remove(i.activity)},this.setMessageActive=()=>{e.classList.add(i.message)},this.setMessageInactive=()=>{e.classList.remove(i.message)},this.setMessageContent=t=>{s.innerText=t},this.setFlashActive=t=>{e.classList.add(i.flash)},this.setFlashInactive=t=>{e.classList.remove(i.flash)},this.setSuccessActive=()=>{e.classList.add(i.success)},this.setSuccessInactive=()=>{e.classList.remove(i.success)},this.setErrorActive=()=>{e.classList.add(i.error)},this.setErrorInactive=()=>{e.classList.remove(i.error)},this.setOverlayVisible=()=>{e.classList.add(i.visible)},this.setOverlayInvisible=()=>{e.classList.remove(i.visible)},this.create=()=>(e=this.buildOverlayEl(),r=this.buildActivityEl(),s=this.buildMessageEl(),e.appendChild(r),e.appendChild(s),e),this.buildOverlayEl=()=>{var t=document.createElement("div");return t.setAttribute("class",i.overlay),t},this.buildActivityEl=()=>{var t=o.default.getUiTextFor("activityOverlay")[a];let e=document.createElement("div");e.setAttribute("class",i.activityAnimationContainer),e=t.animated.reduce((t,e)=>{var n=document.createElement("span");return n.setAttribute("class",i.activityAnimationItem),n.innerHTML=e,t.appendChild(n),t},e);var n=document.createElement("div");return n.setAttribute("class",i.activityStaticText),n.innerText=t.static,(r=document.createElement("div")).setAttribute("class",i.activityContainer),r.appendChild(n),r.appendChild(e),r},this.buildMessageEl=()=>((s=document.createElement("div")).setAttribute("class",i.messageContainer),s),t=t.getSelf(),e=this.create(),t.classList.add(i.parent),t.appendChild(e)}},{"../global/FtConfig":4}]},{},[2]);
//# sourceMappingURL=maps/fluency_standalone_translator.bundle.js.map
