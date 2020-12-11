const { Scenario } = require('./ScenarioObject');
const { Constant } = require('../helper');
const { ReportPortalAgent } = require('../core');
const { LoggerHelper } = require('../../log4js');

class CucumberReportAgent {
  constructor(config, allowSendScreenShot) {
    this.agent = new ReportPortalAgent(config);
    this.logger = new LoggerHelper('CucumberReportAgent');
    this.scenarioObject = {};
    this.allowSendScreenShot = !allowSendScreenShot
      ? true
      : allowSendScreenShot;
  }
  startLaunchCucumber() {
    this.agent.sendLaunchRequest({}, true);
    this.logger.info('Start Launch Cucumber');
  }

  startSuiteCucumber(
    suiteInfo = {
      name: 'Default Suite',
      description: 'Test Suite Run With cucumber-js'
    }
  ) {
    this.agent.sendTestItemRequest(
      {
        type: Constant.TEST_TYPE.SUITE,
        description: suiteInfo.description,
        name: suiteInfo.name
      },
      true
    );
    this.logger.info('Start Suite Cucumber ', suiteInfo);
  }

  startScenarioCucumber(scenario) {
    const scenarioObject = new Scenario(scenario);
    const scenarioDescription = scenarioObject.toString();
    this.agent.sendTestItemRequest(
      {
        type: Constant.TEST_TYPE.TEST,
        description: scenarioDescription,
        name: scenarioObject.name
      },
      true
    );
    this.logger.info('Start Scenario Cucumber ', scenario);
  }

  logStepInfo(logLevel, logMessage) {
    this.agent.sendLogItemRequest({
      level: logLevel,
      message: logMessage
    });
  }

  logStepScreenShot(logLevel, logMessage, fileObject) {
    if (this.allowSendScreenShot) {
      this.agent.sendLogItemRequest(
        {
          level: logLevel,
          message: logMessage
        },
        fileObject
      );
    }
  }

  endScenarioCucumber(scenario) {
    const scenarioObject = new Scenario(scenario);
    const logMessage = JSON.stringify(scenarioObject.result);
    if (scenarioObject.result.status === 'failed') {
      this.logStepInfo(Constant.LOG_LEVEL.ERROR, logMessage);
    } else {
      this.logStepInfo(Constant.LOG_LEVEL.INFO, logMessage);
    }
    this.agent.sendTestItemRequest(
      { status: scenarioObject.result.status },
      false,
      false
    );

    this.logger.info('End Scenario Cucumber ', scenario);
  }

  endSuiteCucumber() {
    this.agent.sendTestItemRequest({}, false, true);
    this.logger.info('End Suite Cucumber');
  }

  async endLaunchCucumber() {
    await this.agent.finishAllAgentRequests();
    return this.agent.sendLaunchRequest({}, false, true).then(() => {
      this.logger.info('End Launch Cucumber');
    });
  }
}

exports.CucumberReportAgent = CucumberReportAgent;
