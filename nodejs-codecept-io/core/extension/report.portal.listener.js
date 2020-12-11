/* eslint-disable ,camelcase,global-require */

const { ReportPortalHelper } = require('../helper');
// const { RunnerConfig } = require('../config');
const { CodeceptReportListener } = require('../report');
/**
 * ReportPortal listener sends request data
 * and holds all request in array
 * we will use engine extend to dispatch all requests
 */
module.exports = () => CodeceptReportListener(ReportPortalHelper, () => {
  const { RunnerConfig } = require('../config');
  return RunnerConfig.isDebugMode;
});
