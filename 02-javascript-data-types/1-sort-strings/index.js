/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const resArr = arr.slice();

  // первоначальный вариант с повторяющимися resArr.sort((a, b) => ...
  /*if (param === 'asc') {
    resArr.sort((a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}));
  }
  if (param === 'desc') {
    resArr.sort((a, b) => b.localeCompare(a, ['ru', 'en'], {caseFirst: 'upper'}));
  }
  return resArr;*/

  // исправленный вариант, но с 3 return
  return resArr.sort((a, b) => {
    if (param === 'asc') {
      return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
    }
    if (param === 'desc') {
      return b.localeCompare(a, ['ru', 'en'], {caseFirst: 'upper'});
    }
  });
}
