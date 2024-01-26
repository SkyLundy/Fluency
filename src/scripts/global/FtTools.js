/**
 * These are common tools the Fluency translation module uses
 * It is loaded first in order of scripts added to the page so that the module
 * is available to all subsequent scripts
 *
 * @return {Object}   Public methods
 */
const FtTools = (function () {
  /**
   * Create a random string of hex characters
   * @param  {Number} length
   * @return {String}
   */
  const randomHex = (length = 6) => {
    const chars = '0123456789ABCDEF'.split('');

    [...Array(length)].reduce(
      (hex, i) => (hex = chars[Math.floor(Math.random() * chars.length)]),
      ''
    );
  };

  /**
   * Generate random string of upper/lower/ints
   * @param length
   * @return string
   */
  const createRandomString = (length = 5) =>
    [...Array(length)].map(() => Math.random().toString(36)[2]).join('');

  /**
   * Appends a div to a given element with a defined string, optionally adds a unique
   * string in case differentiating between more than one with the same text is
   * needed
   * @param  {Element}  element    Element to tag
   * @param  {String}  text        Text for tag
   * @param  {Boolean} addRandomId Add random ID string to tag
   * @return {Void}
   */
  const tagElement = (element, text, addRandomId = true) => {
    const tagDiv = document.createElement('div');

    tagDiv.setAttribute('class', 'ft-element-tag');

    if (addRandomId) {
      text += ' | ' + createRandomString();
    }

    tagDiv.innerText = text;

    element.appendChild(tagDiv);
  };

  /**
   * Creates a random HTML hex code
   * @return {String} [description]
   */
  const randomHexColor = () => `#${randomHex()}`;

  /**
   * Gets the page ID from the current URL
   * @return {int|null} Page ID number, null if not present
   */
  var getPageId = function () {
    var urlParams = new URLSearchParams(window.location.search);

    return urlParams ? parseInt(urlParams.get('id')) : null;
  };

  /**
   * Checks page ID against page ID passed
   * @param  {int}  id ID to check against
   * @return {bool}    True/false whether is current page ID
   */
  const pageIdIs = id => getPageId() === id;

  return {
    tagElement,
    getPageId,
    pageIdIs,
  };
})();

export default FtTools;
