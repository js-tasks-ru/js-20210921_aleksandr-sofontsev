/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let resObj = {};

  // первоначальный вариант
  /*for (let i = 0; i < [...fields].length; i++) {
    resObj[fields[i]] = '';
  }

  for (const [key, value] of Object.entries(obj)) {
    if (resObj.hasOwnProperty(key)) {
      resObj[key] = value;
    }
  }

  for (const key in resObj) {
    if (resObj[key] === '') {
      delete resObj[key];
    }
  }*/

  // исправленный вариант
  Object.entries(obj).forEach(([key, value]) => {
    if (fields.indexOf(key) !== -1) {
      resObj[key] = value;
    }
  });

  return resObj;
};
