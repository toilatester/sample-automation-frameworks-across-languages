const { LoggerManager } = require('../../log/logger');
const { ReportHelper } = require('../../helper/report.helper');
const { TimerHelper } = require('../../helper/timer.helper');
const { Constant } = require('../../report');
const { AbstractRequest } = require('./base.request');
const { format } = require('util');

const loggerRequestData = (testContext, ...data) => {
  const loggerRequestMessage = ['!!!MARKDOWN_MODE!!!', `### TEST CONTEXT: ${testContext}`, '### REQUEST DATA'];
  data.forEach((item) => {
    global.log && item && !item.headers && console.log('BEGIN REQUEST\n', JSON.stringify(item, null, 2));
    if (item instanceof Object) {
      loggerRequestMessage.push(`### REQUEST BODY DATA:\n\`\`\`javacript\n${JSON.stringify(item)}\n\`\`\`\n`);
      const keys = Object.keys(item);
      keys.forEach((key) => {
        loggerRequestMessage.push(`### ${key}:\n\`\`\`javacript\n${JSON.stringify(item[key])}\n\`\`\`\n`);
      });
    } else {
      loggerRequestMessage.push(`### REQUEST PATH:\n\`\`\`javacript\n${JSON.stringify(item)}\n\`\`\`\n`);
    }
  });
  const logMessage = loggerRequestMessage.join('\n');
  ReportHelper.sendLogItemRequest(testContext, {
    message: logMessage,
    level: Constant.LOG_LEVEL.DEBUG
  });
  LoggerManager.debug(testContext, logMessage);
};

const loggerResponseData = (testContext, responseData, log, level) => {
  global.log && console.log('BEGIN RESPONSE\n', JSON.stringify(responseData.data, null, 2));
  const loggerResponeDataMessage = [
    '!!!MARKDOWN_MODE!!!',
    `### TEST CONTEXT: ${testContext}`,
    '### RESPONSE DATA',
    `### REQUEST URL:\n\`\`\`javacript\n${responseData.config.url}\n\`\`\`\n`,
    `### REQUEST METHOD:\n\`\`\`javacript\n${responseData.request._header}\n\`\`\`\n`,
    `### REQUEST HEADER:\n\`\`\`javacript\n${JSON.stringify(responseData.config.headers)}\n\`\`\`\n`,
    `### RESPONSE STATUS CODE:\n\`\`\`javacript\n${JSON.stringify(responseData.status)}\n\`\`\`\n`,
    `### RESPONSE STATUS TEXT:\n\`\`\`javacript\n${JSON.stringify(responseData.statusText)}\n\`\`\`\n`,
    `### RESPONSE HEADER:\n\`\`\`javacript\n${JSON.stringify(responseData.headers)}\n\`\`\`\n`,
    `### RESPONSE DATA: \n\`\`\`javacript\n${JSON.stringify(responseData.data, null, 2)}\n\`\`\`\n`
  ];
  const logMessage = loggerResponeDataMessage.join('\n');
  ReportHelper.sendLogItemRequest(testContext, {
    message: logMessage,
    level
  });
  log(testContext, logMessage);
};

async function dispatchRequest(testContext, req, ...data) {
  // Retry send request avoid having error relate to SSL
  // Max retry 5 time
  const maxRetry = 5;
  return retryDispatchRequest(testContext, maxRetry, createDispatchFunction, req, ...data);
}

async function retryDispatchRequest(testContext, maxRetry, dispatchFunction, req, ...data) {
  let result = null;
  for (let currentRetry = 0; currentRetry < maxRetry && !result; currentRetry++) {
    try {
      result = await dispatchFunction(testContext, req, ...data);
    } catch (error) {
      if (currentRetry === maxRetry) throw error;
      const errorSendRequestLogMessage = [
        '!!!MARKDOWN_MODE!!!',
        `### TEST CONTEXT: ${testContext}`,
        `### RETRY SEND REQUEST ${currentRetry}`,
        `### REQUEST URL:\n\`\`\`javacript\n${format(error)}\n\`\`\`\n`
      ];
      ReportHelper.sendLogItemRequest(testContext, {
        message: errorSendRequestLogMessage.join('\n'),
        level: Constant.LOG_LEVEL.WARN
      });
      // Add delay time for any internet connection error
      await TimerHelper.sleep(currentRetry * 500);
    }
  }
  return Promise.resolve(result);
}

async function createDispatchFunction(testContext, req, ...data) {
  let result = {};
  try {
    loggerRequestData(testContext, ...data);
    result = await req(...data);
    loggerResponseData(testContext, result, LoggerManager.debug, Constant.LOG_LEVEL.DEBUG);
  } catch (error) {
    result = error.response;
    const errorString = format(error);
    LoggerManager.error(testContext, errorString);
    if (!result) {
      // network error, we will log it and terminate execution
      const errorSendRequestLogMessage = [
        '!!!MARKDOWN_MODE!!!',
        `### TEST CONTEXT: ${testContext}`,
        '### ERROR SEND REQUEST',
        `### REQUEST URL:\n\`\`\`javacript\n${errorString}\n\`\`\`\n`
      ];
      ReportHelper.sendLogItemRequest(testContext, {
        message: errorSendRequestLogMessage.join('\n'),
        level: Constant.LOG_LEVEL.ERROR
      });
      throw error;
    }
    loggerResponseData(testContext, result, LoggerManager.error, Constant.LOG_LEVEL.ERROR);
  }
  return result;
}

const METHODS = {
  GET: async (testContext, req, ...data) => {
    return dispatchRequest(testContext, req.get, ...data);
  },
  POST: async (testContext, req, ...data) => {
    return dispatchRequest(testContext, req.post, ...data);
  },
  PUT: async (testContext, req, ...data) => {
    return dispatchRequest(testContext, req.put, ...data);
  },
  PATCH: async (testContext, req, ...data) => {
    return dispatchRequest(testContext, req.patch, ...data);
  },
  DELETE: async (testContext, req, ...data) => {
    return dispatchRequest(testContext, req.delete, ...data);
  }
};

const joinPath = (first, second) => {
  if (!first || !second) return second;
  const lastPart = second[0] !== '/' ? `/${second}` : second;
  return first + lastPart;
};

class RestRequest extends AbstractRequest {
  constructor(config) {
    super();
    this.initConfigService(config);
  }

  /**
   * Get rest request instance
   */
  get requestObject() {
    return this.createRestRequestObject();
  }

  get requestTimeout() {
    return this.__timeOut;
  }

  set requestTimeout(timeOut) {
    if (Math.sign(timeOut) === 1) {
      this.__timeOut = timeOut;
    }
  }

  set defaultData(data) {
    if (data) {
      this.data = data;
    }
  }
  /**
   * Get response body
   */
  get responseBody() {
    return this.__responseBody;
  }
  /**
   * Get response code
   */
  get responseCode() {
    return this.__responseCode;
  }

  /**
   *
   * @param {Object} requestData
   * params should look like this
   * {
   *  path: "your_path_request",
   *  params: {"key": value},
   *  headers: {"key": value}
   * }
   *
   * @returns {Object} responseData
   * response data sample
   *{ body: responseBodyValue, status: responseCodeValue }
   */
  async get(requestData = { path: '/', params: {}, headers: {} }) {
    const { path, params, headers } = requestData;
    const urlPath = joinPath(this.namespace, path);
    const request = METHODS.GET;
    await this.storeAuthenticateToken();
    const result = await request(this.__testContext, this.restRequestObject, urlPath, {
      headers: Object.assign({}, this.defaultHeaders(), headers),
      params
    });
    this.parseResult(result);
    return { body: this.responseBody, status: this.responseCode };
  }

  /**
   *
   * @param {Object} requestData
   * params should look like this
   * {
   *  path: "your_path_request",
   *  data: {"key":value},
   *  headers: {"key":value}
   * }
   *
   * @returns {Object} responseData
   * response data sample
   *{ body: responseBodyValue, status: responseCodeValue }
   */
  async post(requestData = { path: '/', data: {}, headers: {} }) {
    const { path, data, headers } = requestData;
    const urlPath = joinPath(this.namespace, path);
    const request = METHODS.POST;
    await this.storeAuthenticateToken();
    const result = await request(this.__testContext, this.restRequestObject, urlPath, data, {
      headers: Object.assign({}, this.defaultHeaders(), headers)
    });
    this.parseResult(result);
    return { body: this.responseBody, status: this.responseCode };
  }

  /**
   *
   * @param {Object} requestData
   * params should look like this
   * {
   *  path: "your_path_request",
   *  data: {"key":value},
   *  headers: {"key":value}
   * }
   *
   * @returns {Object} responseData
   * response data sample
   *{ body: responseBodyValue, status: responseCodeValue }
   */
  async put(requestData = { path: '/', data: {}, headers: {} }) {
    const { path, data, headers } = requestData;
    const urlPath = joinPath(this.namespace, path);
    const request = METHODS.PUT;
    await this.storeAuthenticateToken();
    const result = await request(this.__testContext, this.restRequestObject, urlPath, data, {
      headers: Object.assign({}, this.defaultHeaders(), headers)
    });
    this.parseResult(result);
    return { body: this.responseBody, status: this.responseCode };
  }

  /**
   *
   * @param {Object} requestData
   * params should look like this
   * {
   *  path: "your_path_request",
   *  data: {"key":value},
   *  headers: {"key":value}
   * }
   *
   * @returns {Object} responseData
   * response data sample
   *{ body: responseBodyValue, status: responseCodeValue }
   */
  async delete(requestData = { path: '/', data: {}, headers: {} }) {
    const { path, data, headers } = requestData;
    const urlPath = joinPath(this.namespace, path);
    const request = METHODS.DELETE;
    await this.storeAuthenticateToken();
    const result = await request(this.__testContext, this.restRequestObject, urlPath, data, {
      headers: Object.assign({}, this.defaultHeaders(), headers)
    });
    this.parseResult(result);
    return { body: this.responseBody, status: this.responseCode };
  }

  /**
   *
   * @param {Object} requestData
   * params should look like this
   * {
   *  path: "your_path_request",
   *  data: {"key":value},
   *  headers: {"key":value}
   * }
   *
   * @returns {Object} responseData
   * response data sample
   *{ body: responseBodyValue, status: responseCodeValue }
   */
  async patch(requestData = { path: '/', data: {}, headers: {} }) {
    const { path, data, headers } = requestData;
    const urlPath = joinPath(this.namespace, path);
    const request = METHODS.PATCH;
    await this.storeAuthenticateToken();
    const result = await request(this.__testContext, this.restRequestObject, urlPath, data, {
      headers: Object.assign({}, this.defaultHeaders(), headers)
    });
    this.parseResult(result);
    return { body: this.responseBody, status: this.responseCode };
  }
}

exports.RestRequest = RestRequest;
