const _ = require('lodash');
const { random } = require('lodash');

function randomNumber(count = 5) {
  return Math.floor(Math.random() * Math.pow(10, count));
}

function randomIndexes(count, arrayLength) {
  if (arrayLength <= count) {
    return _.range(arrayLength);
  }

  const indexes = [];
  while (indexes.length < count) {
    const index = Math.floor(Math.random() * 1000000) % arrayLength;
    if (!indexes.includes(index)) {
      indexes.push(index);
    }
  }

  return indexes;
}

function randomString(text = 'text', maxNumber) {
  if (typeof maxNumber === 'undefined') maxNumber = Number.MAX_SAFE_INTEGER;
  return text + random(0, maxNumber);
}

module.exports = {
  randomNumber,
  randomIndexes,
  randomString
};
