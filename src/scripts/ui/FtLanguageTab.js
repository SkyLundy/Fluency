/**
 * A stateful function handling  behaviors for a language tab associated with a input container
 * contained within an Inputfield. An "input container" is the div that contains the label and
 * input/textarea/element (depending on Inputfield type) for a language
 * @param {Element} inputContainer Language
 */
const FtLanguageTab = function (inputContainer) {
  /**
   * Note
   * @type {String}
   */
  const contentModifiedClass = 'ft-content-changed';

  /**
   * Cached associated tab for this input container
   * @type {Element}
   */
  let languageTab = null;

  this.getContentModifiedClass = () => contentModifiedClass;

  /**
   * Sets state of tab
   * @param  {bool} modified Determines state of tab display
   * @return {void}
   */
  this.setModifiedState = modified => (modified ? this.setTabModified() : this.setTabUnmodified());

  this.setTabModified = () => this.getLanguageTab().classList.add(contentModifiedClass);

  this.setTabUnmodified = () => this.getLanguageTab().classList.remove(contentModifiedClass);

  this.getLanguageTab = () => {
    return (
      languageTab ??
      inputContainer
        .closest('.langTabs')
        .querySelector(`.langTabLink[data-lang="${inputContainer.dataset.language}"`)
    );
  };

  /**
   * Init method executed on object instantiation
   * @return {void}
   */
  (() => {
    if (!inputContainer) {
      return false;
    }

    languageTab = this.getLanguageTab();
  })();
};

export default FtLanguageTab;
