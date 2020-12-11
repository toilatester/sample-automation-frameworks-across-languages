const ReportportalClient = require('reportportal-client');
const {
  LoggerHelper
} = require('../log4js')
const {
  ReportPortalObject,
  Constant
} = require('./helper');
const Logger = new LoggerHelper("ReportPortalClient");

const launchRequestBody = () => {
  return {
    description: '',
    name: '',
    tags: [],
  }
}

const testRequestBody = () => {
  return {
    type: '',
    description: '',
    name: ''
  }
}

const logRequestBody = () => {
  return {
    level: '',
    message: ''
  }
}

const finishItemRequestBody = () => {
  return {
    status: ''
  }
}

const launchBodyBuilder = (data) => {
  const launchBody = launchRequestBody();
  return mapRequestObject(launchBody, data, true);
}

const testItemBodyBuilder = (data) => {
  const testBody = testRequestBody();
  return mapRequestObject(testBody, data, false);
}

const logBodyBuilder = (data) => {
  const logBody = logRequestBody();
  return mapRequestObject(logBody, data, false);
}


const finishItemBodyBuilder = (data) => {
  const finishBody = finishItemRequestBody();
  return mapRequestObject(finishBody, data, false);
}

const mapRequestObject = (rawRequestBody, requestData, isBuildLaunchBody) => {
  const requestBody = {};
  const isEmptyObject = Object.keys(requestData).length === 0;
  const isInvalidBuildTestBodyData = isEmptyObject && !isBuildLaunchBody;
  if (isInvalidBuildTestBodyData) {
    throw Constant.ERROR_MESSAGE(testRequestBody, finishItemRequestBody, logRequestBody);
  }
  if (!isBuildLaunchBody) {
    Object.keys(rawRequestBody).forEach(requestKey => {
      requestBody[requestKey] = requestData[requestKey];
    })
  }
  return requestBody;
}

class BaseAgent {

  constructor(config) {
    this.client = this.initReportPortalClient(config);
    this.reportPortalObject = new ReportPortalObject();
  }

  getReportPortalObject() {
    return this.reportPortalObject;
  }

  initReportPortalClient(config) {
    const client = new ReportportalClient(config);
    Logger.logInfo(client);
    this.checkReportConnection(client);
    return client;
  }

  checkReportConnection(client) {
    client.checkConnect().then((response) => {
      Logger.logInfo(`Check Connect Pass: `, response);
    }, (error) => {
      Logger.logError(`Check Connect Fail: `, error);
    });
  }

  getReportPortalClient() {
    return this.client;
  }

  startLaunch(launch = {}) {
    const launchObject = this.client.startLaunch(launchBodyBuilder(launch));
    Logger.logInfo(`Start Launch: `, launchObject);
    this.reportPortalObject.setLaunchId(launchObject.tempId);
  }
  startBeforeSuite(beforeSuiteInfo) {
    const beforeSuiteObject = this.client.startTestItem(
      testItemBodyBuilder(beforeSuiteInfo),
      this.reportPortalObject.getLaunchId());
    Logger.logInfo(`Start Before Suite: `, beforeSuiteObject);
    this.reportPortalObject.setBeforeSuitesId(beforeSuiteObject.tempId);
  }

  finishBeforeSuite(methodStatus) {
    const finishBeforeSuiteObject = this.client.finishTestItem(this.reportPortalObject.getBeforeSuitesId(),
      finishItemBodyBuilder(methodStatus));
    Logger.logInfo(`Finish Before Suite: `, finishBeforeSuiteObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.suitesId);
  }

  startSuite(suite) {
    const suiteObject = this.client.startTestItem(
      testItemBodyBuilder(suite),
      this.reportPortalObject.getLaunchId());
    Logger.logInfo(`Start Suite: `, suiteObject);
    this.reportPortalObject.setSuitesId(suiteObject.tempId);
  }

  startBeforeTest(beforeTestInfo, parentId) {
    const beforeTestObject = this.client.startTestItem(
      testItemBodyBuilder(beforeTestInfo),
      this.reportPortalObject.getLaunchId(),
      parentId);
    Logger.logInfo(`Start Before Test: `, beforeTestObject);
    this.reportPortalObject.setBeforeTestsId(beforeTestObject.tempId);
  }

  finishBeforeTest(methodStatus) {
    const finishBeforeTestObject = this.client.finishTestItem(this.reportPortalObject.getBeforeTestsId(),
      finishItemBodyBuilder(methodStatus))
    Logger.logInfo(`Finish Before Test: `, finishBeforeTestObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.beforeTestsId);
  }

  startTest(test) {
    const testObject = this.client.startTestItem(
      testItemBodyBuilder(test),
      this.reportPortalObject.getLaunchId(),
      this.reportPortalObject.getSuitesId());
    Logger.logInfo(`Start Test: `, testObject);
    this.reportPortalObject.setTestItemsId(testObject.tempId);
  }

  startScenario(scenario, parentId) {
    const scenarioObject = this.client.startTestItem(
      testItemBodyBuilder(scenario),
      this.reportPortalObject.getLaunchId(),
      parentId);
    Logger.logInfo(`Start Scenario: `, scenarioObject);
    this.reportPortalObject.setScenariosId(scenarioObject.tempId);
  }

  startBeforeMethod(beforeMethodInfo, parentId) {
    const beforeMethodObject = this.client.startTestItem(
      testItemBodyBuilder(beforeMethodInfo),
      this.reportPortalObject.getLaunchId(),
      parentId);
    Logger.logInfo(`Start Before Method: `, beforeMethodObject);
    this.reportPortalObject.setBeforeMethodsId(beforeMethodObject.tempId);
  }

  finishBeforeMethod(methodStatus) {
    const finishBeforeMethodObject = this.client.finishTestItem(this.reportPortalObject.getBeforeMethodsId(),
      finishItemBodyBuilder(methodStatus))
    Logger.logInfo(`Finish Before Method: `, finishBeforeMethodObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.beforeMethodsId);
  }

  startStep(step, parentId) {
    const stepObject = this.client.startTestItem(
      testItemBodyBuilder(step),
      this.reportPortalObject.getLaunchId(), parentId);
    Logger.logInfo(`Start Step Method: `, stepObject)
    this.reportPortalObject.setStepsId(stepObject.tempId);
  }

  startAfterMethod(afterMethodInfo, parentId) {
    const afterMethodObject = this.client.startTestItem(
      testItemBodyBuilder(afterMethodInfo), this.reportPortalObject.getLaunchId(), parentId);
    Logger.logInfo(`Start After Method: `, afterMethodObject);
    this.reportPortalObject.setAfterMethodsId(afterMethodObject.tempId);
  }

  finishAfterMethod(methodStatus) {
    const finishAfterMethodObject = this.client.finishTestItem(this.reportPortalObject.getAfterMethodsId(),
      finishItemBodyBuilder(methodStatus));
    Logger.logInfo(`Finish After Method: `, finishAfterMethodObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.afterMethodsId);
  }

  logStepInfo(logData, hasAttachItemId, fileObj) {
    const itemId = hasAttachItemId ? hasAttachItemId : this.reportPortalObject.getStepsId();
    let logInfoObject = this.client.sendLog(itemId,
      logBodyBuilder(logData), fileObj);
    Logger.logInfo(`Log Method: `, logInfoObject);
  }

  finishStep(stepStatus) {
    const finishStepObject = this.client.finishTestItem(this.reportPortalObject.getStepsId(),
      finishItemBodyBuilder(stepStatus));
    Logger.logInfo('Finish Step ', finishStepObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.stepsId)
  }

  finishScenario(scenarioStatus) {
    const finishScenarioObject = this.client.finishTestItem(this.reportPortalObject.getScenariosId(),
      finishItemBodyBuilder(scenarioStatus));
    Logger.logInfo('Finish Scenario ', finishScenarioObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.scenariosId);
  }

  finishTest(testStatus) {
    const finishTestObject = this.client.finishTestItem(this.reportPortalObject.getTestItemsId(),
      finishItemBodyBuilder(testStatus));
    Logger.logInfo('Finish Test ', finishTestObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.testItemsId);
  }

  startAfterTest(afterTestInfo, parentId) {
    const afterTestObject = this.client.startTestItem(
      testItemBodyBuilder(afterTestInfo), this.reportPortalObject.getLaunchId(), parentId);
    Logger.logInfo(`Start After Test: `, afterTestObject);
    this.reportPortalObject.setAfterTestsId(afterTestObject.tempId);
  }

  finishAfterTest(methodStatus) {
    const finishAfterTestObject = this.client.finishTestItem(this.reportPortalObject.getAfterTestsId(),
      finishItemBodyBuilder(methodStatus));
    Logger.logInfo(`Finish After Test: `, finishAfterTestObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.afterTestsId);
  }

  finishSuite(suiteStatus) {
    const finishSuiteObject = this.client.finishTestItem(this.reportPortalObject.getSuitesId(),
      finishItemBodyBuilder(suiteStatus));
    Logger.logInfo('Finish Suite ', finishSuiteObject);
    this.reportPortalObject.finishParent(this.reportPortalObject.suitesId);
  }

  startAfterSuite(afterSuiteInfo, parentId) {
    const afterSuiteObject = this.client.startTestItem(
      testItemBodyBuilder(afterSuiteInfo), this.reportPortalObject.getLaunchId(), parentId);
    Logger.logInfo(`Start After Suite: `, afterSuiteObject)
    this.reportPortalObject.setAfterSuitesId(afterSuiteObject.tempId);
  }

  finishAfterSuite(methodStatus) {
    const finishAfterSuiteObject = this.client.finishTestItem(this.reportPortalObject.getAfterSuitesId(),
      finishItemBodyBuilder(methodStatus));
    Logger.logInfo(`Finish After Suite: `, finishAfterSuiteObject)
    this.reportPortalObject.finishParent(this.reportPortalObject.afterSuitesId);
  }

  finishLaunch(launchStatus) {
    const finishLaunchObject = this.client.finishLaunch(this.reportPortalObject.getLaunchId(),
      finishItemBodyBuilder(launchStatus));
    Logger.logInfo('Finish Launch ', finishLaunchObject);
  }

  finishAllLaunchPromise() {
    return this.client.getPromiseFinishAllItems(this.reportPortalObject.getLaunchId());
  }

}

exports.BaseAgent = BaseAgent;