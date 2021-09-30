/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let resStr = '';
  let letterCnt = 0;

  for (let i = 0; i < string.length; i++) {
    if ((i !== 0) && (string[i] !== string[i - 1])) {
      letterCnt = 0;
    }

    if (letterCnt < size) {
      resStr = resStr.concat(string[i]);
      letterCnt++;
    }
  }

  if (size === undefined) {
    resStr = string;
  }

  return resStr;
}
