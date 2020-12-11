/* eslint-disable no-undef,*/
/* eslint-disable no-undef,*/ // in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { RunnerConfig } = require('../../core');
const { AbstractPage } = require('../../core/base');

const I = actor();
class Login extends AbstractPage {
  constructor() {
    super();
  }

  get emailElement() {
    return '#username';
  }

  get passwordElement() {
    return '#password';
  }

  get submitButtonElement() {
    return { css: 'input[value*="Log in"]' };
  }

  open() {
    I.amOnPage(this.runnerConfig.authenticateUrl);
  }

  login() {
    I.fillField(this.emailElement, RunnerConfig.username);
    I.fillField(this.passwordElement, RunnerConfig.password);
    I.click(this.submitButtonElement);
    I.waitForNavigation();
  }
}
exports.Login = Login;
