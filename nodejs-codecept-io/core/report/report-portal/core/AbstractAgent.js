const { LoggerHelper } = require('../../log4js');
const { Constant } = require('../helper');

/**
 * :D I'm MH
 * :D I'm MH
 * :D I'm MH
 * :D I'm MH
 */

function createRequestObject(rawRequestBody, requestData, allowEmptyRequestData) {
  if (allowEmptyRequestData && Object.keys(rawRequestBody).length === 0) {
    return {};
  }
  return Object.assign(rawRequestBody, requestData);
}

function checkValidDataToMapRequest(requestData, isInvalidBuildBodyData, ...message) {
  if (!requestData) {
    throw new Error('Request data Object cannot null');
  }
  if (isInvalidBuildBodyData) {
    const errorMessage = Constant.ERROR_MESSAGE(...message);
    throw new Error(`${errorMessage}`);
  }
}

function mapDataToRequestObject(rawRequestBody, requestData, allowEmptyRequestData, ...message) {
  const isEmptyObject = Object.keys(requestData).length === 0;
  const isInvalidBuildBodyData = isEmptyObject && !allowEmptyRequestData;
  checkValidDataToMapRequest(requestData, isInvalidBuildBodyData, ...message);
  return createRequestObject(rawRequestBody, requestData, allowEmptyRequestData);
}

class AbstractAgent {
  /**
   *
   * @param {ReportportalClient} client
   * param initial from reportportal-client
   */
  constructor(config) {
    this.logger = new LoggerHelper('ReportAgentClient');
    this.client = this.__createAgentClient(config);
    this.requestsProcessList = [];
  }

  __createAgentClient(config) {
    throw new Error('NotImplementedError');
  }

  getClient() {
    return this.client;
  }

  /**
   *
   * @param {*} requestData
   * @param {*} allowEmptyRequestData
   */
  requestDataBodyBuilder(rawRequestBody, requestData, allowEmptyRequestData) {
    const requestBody = rawRequestBody();
    return mapDataToRequestObject(requestBody, requestData, allowEmptyRequestData);
  }

  dispatchAgentRequest(func, ...args) {
    try {
      return func.call(this.client, ...args);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  finishAllAgentRequests() {
    throw new Error('NotImplementedError');
  }
}

exports.AbstractAgent = AbstractAgent;
