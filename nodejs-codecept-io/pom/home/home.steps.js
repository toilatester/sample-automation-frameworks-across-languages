/* eslint-disable no-undef,prefer-destructuring,global-require,func-names*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { Home } = require('./home');

module.exports = function () {
  const homePage = new Home();
  return actor(homePage);
};
