const { equals } = require('codeceptjs/lib/assert/equal');
const { includes } = require('codeceptjs/lib/assert/include');

const createErrorException = (err) => {
  if (err.cliMessage) {
    const innerError = new Error(err.cliMessage());
    Object.assign(innerError, err);
    throw innerError;
  }
  throw err;
};
const assertTextEquals = (actual, expected, message) => {
  try {
    equals('').assert(actual.toString(), expected.toString(), message);
  } catch (err) {
    createErrorException(err);
  }
};

const assertEquals = (actual, expected, message) => {
  try {
    equals('').assert(
      actual,
      expected,
      `${actual} is type [${typeof actual}] \n${expected} is type [${typeof expected}]\n${message}`
    );
  } catch (err) {
    createErrorException(err);
  }
};

const assertTextInclude = (actual, expected, message) => {
  try {
    includes(`'${expected}'`).assert(actual.toString(), expected.toString(), message);
  } catch (err) {
    createErrorException(err);
  }
};

module.exports = { assertTextEquals, assertTextInclude, assertEquals };
