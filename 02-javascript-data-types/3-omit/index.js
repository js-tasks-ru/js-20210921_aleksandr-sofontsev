/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let resObj = {};

  // первоначальный вариант
  /*for (const [key, value] of Object.entries(obj)) {
    let chProp = '';

    for (let i = 0; i < fields.length; i++) {
      if (key === fields[i]) {
        chProp = 'Y';
      }
    }

    if (chProp === '') {
      resObj[key] = value;
    }
  }*/

  // исправленный вариант
  Object.entries(obj).forEach(([key, value]) => {
    if (fields.indexOf(key) === -1) {
      resObj[key] = value;
    }
  });

  return resObj;
};
