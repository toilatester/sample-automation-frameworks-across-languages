const { ReportHelper, RunnerHelper, TimerHelper } = require('../helper');
const { LoggerManager } = require('../log');
const { REQUEST_SERVICE } = require('../engine/request.factory');
const path = require('path');

// eslint-disable-next-line no-undef
before('Set up all suites', async function setUpSuite() {
  // Set timer to update token
  TimerHelper.setUpdateTokenTimestampInSecond();
});
/**
 * Global hook for all mocha test
 * If you need setup steps that rely on each other
 * you should write your function sequentially in the expected order.
 * Example: this will clear all data and after that will close db
 * afterEach('clear data',()=>{})
 * afterEach('close db',()=>{})
 */
afterEach('Send Result To ReportPortal', async function tearDownTest() {
  if (!RunnerHelper.debugMode) {
    await ReportHelper.finishAllAgentRequests();
  }
});
/**
 * Get Token before each step to ensure token will not expire
 * Use count variable to reduce time
 * Consider using method inside dispatchRequest method
 * in rest.request.js if we don't need to have test case
 * to verify request with status code 401
 *
 */
beforeEach('Update Cookie Token Before Test', async function updateCookieToken() {
  // Timer to re-invoke token after 300 seconds
  const tokenExpiredTimer = 300;
  const currentTimestampInSecond = Date.now() / 1000;
  const expiredTokenTime = TimerHelper.updateTokenTimestampInSecond + tokenExpiredTimer;
  const isExpiredToken = expiredTokenTime < currentTimestampInSecond;
  const currentTestContext = path.basename(this.currentTest.file);
  LoggerManager.debug(
    currentTestContext,
    '!!!MARKDOWN_MODE!!!\n### Last Update Token:\n',
    `### ${new Date(TimerHelper.updateTokenTimestampInSecond * 1000)}`
  );
  if (isExpiredToken) {
    const request = REQUEST_SERVICE.REST_SERVICE();
    await request.getAuthenticateToken(null, null, null, null, true);
    TimerHelper.setUpdateTokenTimestampInSecond();
  }
});
