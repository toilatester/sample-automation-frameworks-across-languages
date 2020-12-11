/* eslint-disable no-undef,prefer-destructuring,global-require,func-names*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { Vendor } = require('./vendor');

module.exports = function () {
  const vendorPage = new Vendor();
  return actor(vendorPage);
};
