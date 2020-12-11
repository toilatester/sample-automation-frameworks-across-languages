class ReportPortalObject {
  constructor() {
    this.launchId = [];
    this.suitesId = [];
    this.testItemsId = [];
    this.scenariosId = [];
    this.stepsId = [];
    this.beforeSuitesId = [];
    this.beforeTestsId = [];
    this.beforeMethodsId = [];
    this.afterMethodsId = [];
    this.afterTestsId = [];
    this.afterSuitesId = [];
  }

  getLaunchId() {
    return this.getParentId(this.launchId);
  }

  getSuitesId() {
    return this.getParentId(this.suitesId);
  }

  getTestItemsId() {
    return this.getParentId(this.testItemsId);
  }
  getScenariosId() {
    return this.getParentId(this.scenariosId);
  }

  getStepsId() {
    return this.getParentId(this.stepsId);
  }

  getBeforeSuitesId() {
    return this.getParentId(this.beforeSuitesId);
  }

  getBeforeTestsId() {
    return this.getParentId(this.beforeTestsId);
  }

  getBeforeMethodsId() {
    return this.getParentId(this.beforeMethodsId);
  }

  getAfterSuitesId() {
    return this.getParentId(this.afterSuitesId);
  }

  getAfterTestsId() {
    return this.getParentId(this.afterTestsId);
  }

  getAfterMethodsId() {
    return this.getParentId(this.afterMethodsId);
  }

  setLaunchId(launchId) {
    this.launchId.push(launchId);
  }

  setBeforeSuitesId(beforeSuiteId) {
    this.beforeSuitesId.push(beforeSuiteId);
  }

  setBeforeTestsId(beforeTestId) {
    this.beforeTestsId.push(beforeTestId);
  }

  setBeforeMethodsId(beforeMethodId) {
    this.beforeMethodsId.push(beforeMethodId);
  }

  setAfterSuitesId(afterSuiteId) {
    this.afterSuitesId.push(afterSuiteId);
  }

  setAfterTestsId(afterTestId) {
    this.afterTestsId.push(afterTestId);
  }

  setAfterMethodsId(afterMethodId) {
    this.afterMethodsId.push(afterMethodId);
  }

  setSuitesId(suiteId) {
    this.suitesId.push(suiteId);
  }

  setTestItemsId(testItemId) {
    this.testItemsId.push(testItemId);
  }

  setScenariosId(scenarioId) {
    this.scenariosId.push(scenarioId);
  }

  setStepsId(stepId) {
    this.stepsId.push(stepId);
  }

  finishParent(parentList) {
    parentList.pop();
  }
  getParentId(parentList) {
    if (!parentList.length) {
      return null;
    }
    return parentList[parentList.length - 1];
  }
}

exports.ReportPortalObject = ReportPortalObject;