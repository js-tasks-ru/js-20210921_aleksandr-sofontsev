/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  let resObj = {};

  if (typeof obj === 'undefined') {
    return undefined;
  }
  else {
    Object.entries(obj).forEach(([key, value]) => {
      resObj[value] = key;
    });
    return resObj;
  }
}
