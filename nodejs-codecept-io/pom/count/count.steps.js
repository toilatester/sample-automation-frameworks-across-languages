/* eslint-disable no-undef,prefer-destructuring,global-require,func-names*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { Count } = require('./count');

module.exports = function () {
  const countPage = new Count();
  return actor(countPage);
};
