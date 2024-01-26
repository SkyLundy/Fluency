/**
 * Handles modifying the Fluency menu item
 * @return {object} Public methods
 */
const FtAdminMenu = (function () {
  /**
   * Initializes module
   * @return {void}
   */
  const init = () => {
    convertFtAdminMenuToModal();
  };

  /**
   * Finds and converts the Translation admin menu item to open in a modal
   * rather than navigating to the page.
   * @return {void}
   */
  const convertFtAdminMenuToModal = () => {
    const adminNavItems = document.querySelectorAll('.pw-masthead .pw-primary-nav > li > a'),
      urlParams = new URLSearchParams(window.location.search);

    // We don't want to modify this menu item if we are on the Fluency config page
    // because the modal behavior is not available
    if (urlParams.get('name') === 'Fluency') {
      return false;
    }

    adminNavItems.forEach((el, i) => {
      let hrefSegments = el.href.split('/').filter(Boolean);

      if (hrefSegments[hrefSegments.length - 1].includes('fluency')) {
        el.href = el.href + '?modal=1';
        el.classList.add('pw-modal-large');
        el.classList.add('pw-modal');
      }
    });
  };

  return {
    init: init,
  };
})();

export default FtAdminMenu;
