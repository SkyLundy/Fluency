import Fluency from '../global/Fluency';
import FtActivityOverlay from './FtActivityOverlay';

/**
 * Binds all instances of buttons that clear translation cache
 * @return {object}     Public methods
 */
const FtTranslationCacheControlButtons = (function () {
  /**
   * Initializes this module
   * @return {void}
   */
  const init = () => {
    const clearCacheButtons = [...document.querySelectorAll('.js-ft-clear-translation-cache')];

    if (clearCacheButtons.length) {
      for (let button of clearCacheButtons) {
        new clearCacheButton(button);
      }
    }
  };

  return {
    init,
  };
})();

const clearCacheButton = function (button) {
  /**
   * The button containing Inputfield element
   * @type {Element}
   */
  let inputfield = null;

  /**
   * @type {FtActivityOverlay}
   */
  let activityOverlay = null;

  this.getSelf = () => inputfield;

  this.bindEventListener = () => {
    const notes = this.getSelf().querySelector('.notes');

    button.addEventListener('click', e => {
      e.preventDefault();

      activityOverlay.showActivity();

      Fluency.deleteTranslationCache().then(result => {
        if (result.error) {
          activityOverlay.showError(result.detail);
          return;
        }

        // Reset count in notes
        if (notes) {
          notes.textContent = notes.textContent.split(': ')[0] + ': 0';
        }

        activityOverlay.hide();
      });
    });
  };

  (() => {
    inputfield = button.closest('.Inputfields').parentElement;
    activityOverlay = new FtActivityOverlay(this, 'clearingCache');

    this.bindEventListener();
  })();
};

export default FtTranslationCacheControlButtons;
