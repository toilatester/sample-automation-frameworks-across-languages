const { random } = require('lodash');

/**
 *
 * @param {*} text : pre-fix of string need to generate
 */

function createUniqueString(text, maxNumber) {
  if (typeof maxNumber === 'undefined') maxNumber = Number.MAX_SAFE_INTEGER;
  return text + random(maxNumber).toString();
}

function createRandomNumber(maxNumber) {
  return random(0, maxNumber);
}

module.exports = {
  createUniqueString,
  createRandomNumber
};
