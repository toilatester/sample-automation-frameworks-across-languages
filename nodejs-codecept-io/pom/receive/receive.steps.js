/* eslint-disable no-undef,prefer-destructuring,global-require,func-names*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { Receive } = require('./receive');

module.exports = function () {
  const receivePage = new Receive();
  return actor(receivePage);
};
