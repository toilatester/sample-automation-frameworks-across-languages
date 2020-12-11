/* eslint-disable no-undef,prefer-destructuring,global-require,func-names*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { Login } = require('./login');

module.exports = function () {
  const loginPage = new Login();
  return actor(loginPage);
};
