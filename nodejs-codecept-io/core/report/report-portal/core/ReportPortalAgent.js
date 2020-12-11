/**
 * :D I'm MH
 * :D I'm MH
 * :D I'm MH
 * :D I'm MH
 */
const ReportportalClient = require('reportportal-client');
const { AbstractAgent } = require('./AbstractAgent');
const { Constant, AgentContex } = require('../helper');

function launchRequestBody() {
  return {
    description: '',
    name: '',
    tags: []
  };
}

function testRequestBody() {
  return {
    type: '',
    description: '',
    name: ''
  };
}

function logRequestBody() {
  return {
    level: '',
    message: ''
  };
}

const finishItemRequestBody = () => {
  return {
    status: ''
  };
};
/**
 * All request will store in array end will
 * process to send when we call finishAllAgentRequests method
 * this will help us to make the report with synchronous log data
 */
class ReportPortalAgent extends AbstractAgent {
  /**
   * Create a client for RP.
   * @param {Object} params - Config object.
   * params should look like this
   * {
   *      token: "00000000-0000-0000-0000-000000000000",
   *      endpoint: "http://localhost:8080/api/v1",
   *      launch: "YOUR LAUNCH NAME",
   *      project: "PROJECT NAME",
   * }
   */
  constructor(config) {
    super(config);
    this.agentContex = new AgentContex();
    this.checkConnection = this.checkConnection.bind(this);
  }

  /**
   *
   * @param {Object} config
   */
  __createAgentClient(config) {
    if (!this.client) {
      try {
        return new ReportportalClient(config);
      } catch (err) {
        throw new Error(err);
      }
    }
    return this.client;
  }

  /**
   *
   * @param {ReportportalClient} client
   * param initial from reportportal-client
   */
  async checkConnection() {
    return this.client
      .checkConnect()
      .then(
        (response) => {
          this.logger.debug('CHECK AgentClient: ', this.client);
          this.logger.debug('Check Connect Pass: ', response);
        },
        (error) => {
          this.logger.error('CHECK AgentClient: ', this.client);
          this.logger.error('CHECK CONNECT FAIL: ', error);
        }
      )
      .catch((error) => {
        this.logger.error('CHECK CONNECT FAIL: ', error);
      });
  }

  /**
   *
   * @param {Object} launchInfo
   *
   * params should look like this with isStartLaunch=true
   * launchInfo = {}
   *
   * params should look like this with isStartLaunch=false,isAutoDectectStatus=true
   * launchInfo = {}
   *
   *
   * params should look like this with isStartLaunch=false,isAutoDectectStatus=false
   * TestStatus can get from Constant.TEST_STATUS
   * launchInfo = {status:"PASSED"}
   *
   * @param {Boolean} isStartLaunch
   *
   * Param to send start launch or finish launch
   *
   * @param {Boolean} isAutoDectectStatus
   *
   * Pram to send finish launch with
   */
  async sendLaunchRequest(launchInfo, isStartLaunch, isAutoDectectStatus) {
    if (isStartLaunch) {
      return this.__startLaunchItem(launchInfo);
    }
    return this.__finishLaunchItem(launchInfo, isAutoDectectStatus);
  }

  /**
   * Private method
   * @param {Object} launchInfo
   */
  async __startLaunchItem(launchInfo = {}) {
    const launchItemBody = this.requestDataBodyBuilder(launchRequestBody, launchInfo, true);
    const launchObject = this.dispatchAgentRequest(this.client.startLaunch, launchItemBody);
    this.agentContex.setItem(Constant.TEST_TYPE.LAUNCH, launchObject.tempId);
    this.logger.debug('START LAUNCH: ', launchObject, launchItemBody);
    launchObject.promise.catch((error) => {
      this.logger.error('startLaunchItem ', error);
    });
    return launchObject.promise;
  }

  /**
   *
   * @param {Object} launchInfo
   * @param {Boolean} isAutoDectectStatus
   */
  async __finishLaunchItem(launchInfo, isAutoDectectStatus) {
    const { launchItem } = this.agentContex.getItem();
    const launchItemBody = this.requestDataBodyBuilder(finishItemRequestBody, launchInfo, isAutoDectectStatus);
    const launchObject = this.dispatchAgentRequest(this.client.finishLaunch, launchItem, launchItemBody);
    this.logger.debug('FINISH LAUNCH ', launchObject, launchItemBody);
    launchObject.promise.catch((error) => {
      this.logger.error('finishLaunchItem ', error);
    });
    const itemInfo = this.agentContex.getItem();
    const launchTempId = itemInfo.launchItem;
    this.agentContex.finishItem();
    // We will wait to finish all requests when finish launch
    return this.client.getPromiseFinishAllItems(launchTempId);
  }

  /**
   * This method will store add report request to array
   * and will process to send all request with the method finishAllAgentRequests
   * this will help us to make the report with synchronous log data
   *
   * @param {Object} itemInfo
   *
   * params should look like this with isStartItem=true
   * itemInfo = {
   *   type: 'TEST',
   *   description: 'TEST DESCRIPTION',
   *   name: 'TEST METHOD NAME',
   * }
   *
   * params should look like this with isStartItem=false and isAutoDectectStatus=false
   * TestStatus can get from Constant.TEST_STATUS
   * itemInfo = {
   *   status: 'PASSED'
   * }
   *
   * params should look like this with isStartItem=false and isAutoDectectStatus=true
   * itemInfo = {}
   *
   *
   * @param {Object} isStartItem
   * @param {Object} isAutoDectectStatus
   */
  sendTestItemRequest(itemInfo, isStartItem, isAutoDectectStatus) {
    const allowEmptyItemInfo = false;
    if (isStartItem) {
      this.__startTestItem(itemInfo, allowEmptyItemInfo);
    } else {
      this.__finishTestItem(itemInfo, isAutoDectectStatus);
    }
  }

  /**
   * Private method
   * @param {Object} itemInfo
   * @param {Boolean} allowEmptyItemInfo
   */
  __startTestItem(itemInfo, allowEmptyItemInfo) {
    this.agentContex.setState(itemInfo.type);
    const { launchItem, parentItem } = this.agentContex.getItem();
    const testItemBody = this.requestDataBodyBuilder(testRequestBody, itemInfo, allowEmptyItemInfo);
    const testObject = this.dispatchAgentRequest(this.client.startTestItem, testItemBody, launchItem, parentItem);
    this.logger.debug(`START ${itemInfo.type}: `, testObject, testItemBody);
    this.agentContex.setItem(itemInfo.type, testObject.tempId);
  }

  /**
   * Private method
   * @param {Object} itemInfo
   * @param {Boolean} allowEmptyItemInfo
   */
  __finishTestItem(itemInfo, allowEmptyItemInfo) {
    const { currentItem } = this.agentContex.getItem();
    const testItemBody = this.requestDataBodyBuilder(finishItemRequestBody, itemInfo, allowEmptyItemInfo);
    const testObject = this.dispatchAgentRequest(this.client.finishTestItem, currentItem, testItemBody);
    this.logger.debug(`FINISH ${this.agentContex.state.getCurrentState()}`, testObject, testItemBody);
    testObject.promise.catch((error) => {
      this.logger.error('finishTestItem ', error);
    });
    this.agentContex.finishItem();
  }

  /**
   * This method will store add report request to array
   * and will process to send all request with the method finishAllAgentRequests
   * this will help us to make the report with synchronous log data
   *
   * @param {Object} itemInfo
   * LogLevel can get from Constant.LOG_LEVEL
   * params should look like this with
   * itemInfo = {
   *   level: INFO,
   *   message: 'Sample message',
   * }
   *
   *  @param {Object} fileObject
   *
   *  params should look like this
   *  fileObject = {
   *   type: image/png,
   *   name: fileName,
   *   content: Base64String,
   *  }
   *
   *  @param {String} parrentId
   *
   *  Allow user to attach specific item to attach log
   */
  sendLogItemRequest(itemInfo, fileObject, parrentId, callback) {
    const allowEmptyItemInfo = false;
    const { currentItem } = this.agentContex.getItem();
    // Allow user send log with specific itemId
    // If parameter is not input agent will get the current item in contex
    const attachItemId = parrentId || currentItem;
    const testItemBody = this.requestDataBodyBuilder(logRequestBody, itemInfo, allowEmptyItemInfo);
    if (this.agentContex.getCurrentContexState() === Constant.TEST_TYPE.TEST) {
      const logObject = this.dispatchAgentRequest(this.client.sendLog, attachItemId, testItemBody, fileObject);
      if (callback) {
        return logObject.promise(callback);
      }
      return logObject.promise;
    }
    return Promise.resolve('Log request for Launch or Suite item');
  }

  finishAllAgentRequests() {
    // We wait for all request finish in finish launch already
    return true;
  }
}
exports.ReportPortalAgent = ReportPortalAgent;
