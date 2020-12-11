/* eslint-disable no-undef,func-names*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { Order } = require('./order');

module.exports = function () {
  const orderPage = new Order();
  return actor(orderPage);
};
