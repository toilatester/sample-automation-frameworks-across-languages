const { default: axios } = require('axios');
const { Agent } = require('https');
const { stringify } = require('querystring');
const path = require('path');
const { RunnerHelper } = require('../../helper/runner.helper');
const { Authenticate } = require('../../helper/authenticate.helper');
const { LoggerManager } = require('../../log');

const createTokenCookie = (token) => {
  return `ID_TOKEN=${token}`;
};

const getCurrentTestContextFile = function getStackTrace() {
  const obj = {};
  Error.captureStackTrace(obj, getStackTrace);
  const lines = obj.stack.split('\n');
  const textContextLine = lines
    .filter((line) => line.includes('scenarios'))
    .map((line) => {
      const rawTestFilePath = line.match(/\((\w*\W*)*/gm)[0];
      const rawTestFilePathRemoveBrackets = rawTestFilePath.replace(/\(*\)*/gm, '');
      const testContextWithLineNumber = path.basename(rawTestFilePathRemoveBrackets);
      const testFilePath = testContextWithLineNumber.split(':')[0];
      return path.basename(testFilePath);
    });
  return textContextLine[0];
};
// We store in Base Request scope to ensure all
// Implement serivces can share a cookie token
// instead of call getAuthenticateToken multiple time
// each time they instance their object
let cookieTokenCache = null;
const authenticateHelper = new Authenticate();
class AbstractRequest {
  constructor() {
    this.protocol = '';
    this.host = '';
    this.port = '';
    this.baseUrl = '';
    this.namespace = '';
    this.defaultHeaders = null;
    this.data = null;
    this.config = null;
    this.ediConfig = null;
    this.__restRequestObject = null;
    this.__timeOut = 10000;
    this.__responseCode = 0;
    this.__rawResponseError = null;
    this.__rawResponse = null;
    this.__responseBody = null;
    this.__responseHeaders = null;
    this.__testContext = getCurrentTestContextFile();
  }

  initConfigService(configObject) {
    this.config = !configObject ? RunnerHelper.getServiceConfig() : RunnerHelper.getServiceConfigFromJson(configObject);
    this.protocol = this.config.protocol;
    this.host = this.config.host;
    this.port = this.config.port;
    this.baseUrl = this.config.baseUrl;
    this.baseRecipeUrl = this.config.baseRecipeUrl;
    this.namespace = this.config.namespace;
    this.storeKeys = this.config.storeKeys;
    this.__timeOut = this.config.timeout;
    this.defaultHeaders = () => {
      // Try to get cookieToken from global scope
      // get from cache variable
      return {
        Cookie: global.LOGIN_COOKIE || cookieTokenCache
      };
    };
    this.data = {};
    this.__responseBody = {};
    this.__responseCode = 0;
  }

  initSftpConfigService(configObject) {
    this.config = !configObject ? RunnerHelper.getSftpConfig() : RunnerHelper.getSftpConfigFromJson(configObject);
    this.protocol = this.config.protocol;
    this.host = this.config.host;
    this.port = this.config.port;
    this.username = this.config.username;
    this.password = this.config.password;
  }

  /**
   * Init request library object
   */
  get getRequestObject() {
    throw new Error('NotImplementedError');
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

  get rawResponseBody() {
    return this.__rawResponse;
  }

  get rawResponseError() {
    return this.__rawResponseError;
  }

  get responseBody() {
    return this.__responseBody;
  }

  get responseCode() {
    return this.__responseCode;
  }

  get responseHeaders() {
    return this.__responseHeaders;
  }

  get restRequestObject() {
    if (!this.__restRequestObject) this.__restRequestObject = this.createRestRequestObject();
    return this.__restRequestObject;
  }

  stringifyFormUrlencodedData(data) {
    return stringify(data);
  }

  createRestRequestObject(url, headers, timeOut) {
    const restUrl = url || this.baseUrl;
    const restTimeout = timeOut || this.__timeOut;
    const restHeaders = headers || this.defaultHeaders();
    return axios.create({
      httpsAgent: new Agent({
        rejectUnauthorized: false
      }),
      baseURL: restUrl,
      timeout: restTimeout,
      headers: restHeaders
    });
  }

  parseResult(result) {
    try {
      this.__responseHeaders = result.headers || {};
      this.__responseBody =
        result.data || result.body || 'Error in send request. Access rawResponseBody property for more details';
      this.__responseCode = result.status || -1;
    } catch (error) {
      this.__rawResponse = result;
      this.__rawResponseError = error;
      this.__responseHeaders = {};
      this.__responseBody = `Error in send request ${error}. Access rawResponseError property for more details`;
      this.__responseCode = -1;
    }
  }

  async storeAuthenticateToken(username, password, impersonateUserName, env, isUpdateCookieCache = false) {
    cookieTokenCache = await this.getAuthenticateToken(
      username,
      password,
      impersonateUserName,
      env,
      isUpdateCookieCache
    );
  }

  async getAuthenticateToken(username, password, impersonateUserName, env, isUpdateCookieCache = false) {
    try {
      if (!cookieTokenCache || isUpdateCookieCache) {
        username = username || this.config.username;
        password = password || this.config.password;
        impersonateUserName = impersonateUserName || this.config.impersonateUserName;
        env = env || this.config.env;
        const idToken = await authenticateHelper.getApplicationIdToken(username, password, impersonateUserName, env);
        const cookieToken = createTokenCookie(idToken);
        LoggerManager.warn(this.__testContext, `!!!MARKDOWN_MODE!!!\n### Update token:\n### ${cookieTokenCache}`);
        return cookieToken;
      }
      return cookieTokenCache;
    } catch (err) {
      LoggerManager.error(this.__testContext, `!!!MARKDOWN_MODE!!!\n### Update token failed:\n### ${err}`);
      // Re-throw for execute terminate process
      throw err;
    }
  }
}

exports.AbstractRequest = AbstractRequest;
