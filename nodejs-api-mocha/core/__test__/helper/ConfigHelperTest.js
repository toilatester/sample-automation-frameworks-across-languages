/* eslint-disable global-require,max-len,no-undef, no-empty */
const sinon = require('sinon');

describe('Unit test report.helper.js', function s() {
  let sandbox = sinon.createSandbox();
  after(function cleanSuite() {});
  beforeEach('Set up sandbox', function setUp() {
    sandbox = sinon.createSandbox();
  });

  afterEach('Clean sandbox', function clean() {
    sandbox.restore();
  });
});
