const run = require('codeceptjs/lib/command/run');
const def = require('codeceptjs/lib/command/definitions');
const path = require('path');
const fs = require('fs');
const { ReportPortalHelper } = require('../helper');

// :( Codecept.io loads hook with a relative path
const hookPath = `.${path.sep}core${path.sep}runner${path.sep}hook.js`;
// temporary runner config file, it will remove after running test
const TEMP_RUNNER_CONFIG = 'runnerConfig.json';
const tempConfigFileProcess = (isDelete, data) => {
  !isDelete && fs.writeFileSync(TEMP_RUNNER_CONFIG, JSON.stringify(data));
  isDelete && fs.unlinkSync(TEMP_RUNNER_CONFIG);
};

class Execute {
  constructor(runnerConfig, reportConfig) {
    this.__runnerConfig = runnerConfig;
    this.__reportPortalConfig = reportConfig;
    this.__runnerConfig.bootstrap = hookPath;
    this.__runnerConfig.teardown = hookPath;
  }

  /**
   *
   * Method to instance report agent connection
   * It can create multiple report agnet connection
   * and store to map with reportAgentStoreKey
   * @param {Object} agentClass
   * @param {Object} config
   * ReportPortal.io config options
   * Ex:
   * {
   *   "host": "http://192.168.50.96:8080",
   *   "token": "326fb87a-2588-4e8e-ad32-a5171b345467",
   *   "endpoint": "http://192.168.50.96:8080/api/v1",
   *   "launch": "GUI_DEBUG",
   *   "project": "mh",
   *   "attachPicturesToLogs": true,
   *   "takeScreenshot": "onFailure",
   *   "debug": false
   * }
   * @param {String} reportAgentStoreKey
   */
  async createReportAgent(agentClass, config, reportAgentStoreKey) {
    ReportPortalHelper.reportAgentClass = agentClass;
    return ReportPortalHelper.createReportAgent(
      config || this.__reportPortalConfig,
      reportAgentStoreKey || ReportPortalHelper.defaultReportStoreKey
    );
  }

  /**
   *
   * @param {String} singleTest
   * @param {String} grep
   * @param {boolean} isVerbose
   */
  run(singleTest, grep = null, isVerbose = false) {
    tempConfigFileProcess(false, this.__runnerConfig);
    run(singleTest, {
      grep,
      verbose: isVerbose,
      reporter: this.__runnerConfig.reportName,
      config: path.resolve(TEMP_RUNNER_CONFIG)
    });
    !isVerbose && tempConfigFileProcess(true);
  }

  createStepsDefinition(stepDefinitionOutputPath, isVerbose = false) {
    tempConfigFileProcess(false, this.__runnerConfig);
    def(stepDefinitionOutputPath, {
      verbose: true,
      config: path.resolve(TEMP_RUNNER_CONFIG)
    });
    !isVerbose && tempConfigFileProcess(true);
  }
}

exports.Execute = Execute;
