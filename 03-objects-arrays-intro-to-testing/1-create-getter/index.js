/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split('.');

  return function (obj) {
    let resObj = obj;

    for (const value of arr) {
      if (resObj.hasOwnProperty(value)) {
        resObj = resObj[value];
      }
      else {
        return;
      }
    }

    return resObj;
  };
}
