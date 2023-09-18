const FtPage = (function () {
  /**
   * Gets the page ID from the current URL
   * @return {int|null} Page ID number, null if not present
   */
  const getId = () => {
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams ? parseInt(urlParams.get('id')) : null;
  };

  /**
   * Checks page ID against page ID passed
   * @param  {int}  id ID to check against
   * @return {bool}    True/false whether is current page ID
   */
  const currentIdIs = id => getId() === id;

  return {
    getId,
    currentIdIs,
  };
})();

export default FtPage;
