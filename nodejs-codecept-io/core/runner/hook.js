const { ReportPortalHelper } = require('../helper');
const { RunnerConfig } = require('../config/runner.config');
const { CodeceptCompleteLaunchHook } = require('../report');

/**
 * Bootstrap and Teardown hook
 * If we need to have more pre or post actions
 * we can put into bootstrap and teardown arrow function
 */
const bootstrapAllHook = async () => {
  return Promise.resolve();
};
const teardownAllHook = async () => {
  return Promise.resolve();
};
const bootstrapHook = async () => {
  if (RunnerConfig.isDebugMode) return Promise.resolve();
  ReportPortalHelper.sendLaunchRequest(
    ReportPortalHelper.defaultReportStoreKey,
    {
      name: RunnerConfig.launchName,
      description: ReportPortalHelper.reportDescription,
      tags: RunnerConfig.launchTags.concat(ReportPortalHelper.reportTags)
    },
    true
  );
  // If we need async hook we can use await or return async method
  return Promise.resolve();
};

const teardownHook = async () => {
  if (RunnerConfig.isDebugMode) return Promise.resolve();
  await ReportPortalHelper.finishAllAgentRequests(ReportPortalHelper.defaultReportStoreKey);
  await ReportPortalHelper.sendLaunchRequest(ReportPortalHelper.defaultReportStoreKey, {}, false, true);
  return Promise.resolve();
};

const completeLaunchHook = CodeceptCompleteLaunchHook(bootstrapHook, teardownHook, bootstrapAllHook, teardownAllHook);
module.exports = completeLaunchHook;
