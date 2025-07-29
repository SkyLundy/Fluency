/**
 * Determines if a given inputfield contains a Table instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */
const FtIsInputfieldTable = inputfield =>
  isInputfieldTable(inputfield) || isInputfieldTableRow(inputfield);

/**
 * Handles table inputfields on load
 * @param  {Element} inputfield
 * @return {Bool}
 */
const isInputfieldTable = inputfield => !!inputfield.classList.contains('InputfieldTable');

const isInputfieldTableRow = inputfield =>
  !!inputfield.tagName === 'TBODY' &&
  inputfield.querySelectorAll('.InputfieldTable_hasLangTabs').length;

export { FtIsInputfieldTable };
