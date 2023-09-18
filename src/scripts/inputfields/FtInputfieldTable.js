/**
 * Determines if a given inputfield contains a Table instance
 * @param  {Element} inputfield Inputfield (.langTabs) element
 * @return {Bool}
 */
const FtIsInputfieldTable = inputfield => !!inputfield.classList.contains('InputfieldTable');

export { FtIsInputfieldTable };
