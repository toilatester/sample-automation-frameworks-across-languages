const { LoggerManager } = require('../log');
const { default: axios } = require('axios');
const { stringify } = require('querystring');
const { Agent } = require('https');

const getDomainUrl = (env) => {
  let domain = `authdomain-${env}.io`;
  if (env === 'production' || env === 'prd') {
    domain = 'sampleapp.io';
  }
  return domain;
};

const stringifyFormUrlencodedData = (data) => {
  return stringify(data);
};
const createRestRequestObject = (url, headers, timeOut = 30000) => {
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
};

const parseResult = (object, result) => {
  try {
    LoggerManager.debug(null, object);
    object.responseHeaders = result.headers || {};
    object.responseBody = result.data || 'Error in send request';
    object.responseCode = result.status || -1;
  } catch (error) {
    object.responseHeaders = {};
    object.responseBody = 'Error in send request';
    object.responseCode = -1;
  }
};
class Authenticate {
  constructor() {
    this.responseBody = {};
    this.responseCode = 0;
    this.responseHeaders = {};
    this.env = 'qa';
    this.__requestCookie = '';
    this.__keycloakCookie = '';
    this.__authpCookie = '';
    this.__idToken = null;
    this.__accessToken = null;
    this.__userId = null;
    this.__applicationIdToken = null;
  }
  get authenticateUrl() {
    return `https://login.${getDomainUrl(this.env)}`;
  }

  getImpersonateUserIdUrl(userName) {
    return `https://login.${getDomainUrl(
      this.env
    )}/auth/admin/realms/sampleapp/users?max=25&search=${userName}&first=0`;
  }

  async getApplicationIdToken(username, password, impersonateUserName, env = 'qa') {
    try {
      this.env = env;
      this.__applicationIdToken = await this.__getApplicationIdToken(username, password, impersonateUserName);
      return this.__applicationIdToken;
    } catch (err) {
      LoggerManager.error(null, err);
      throw new Error('Has error in get application token');
    }
  }

  async __getApplicationIdToken(username, password, impersonateUserName) {
    let applicationIdToken = null;
    let count = 0;
    do {
      try {
        LoggerManager.debug(null, `Try to get token ${count} time`);
        await this.__getAccessToken(username, password);
        await this.__getUserIdToImpersonate(impersonateUserName);
        applicationIdToken = await this.__getIdToken();
        count++;
      } catch (err) {
        LoggerManager.error(null, err);
        count++;
      }
    } while (count < 5 && !applicationIdToken);
    if (!applicationIdToken) throw new Error('Has error in get application token');
    return applicationIdToken;
  }

  async __getAccessToken(username, password) {
    const request = createRestRequestObject(this.authenticateUrl, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const result = await request.post(
      '/auth/realms/sampleapp/protocol/openid-connect/token',
      stringifyFormUrlencodedData({
        grant_type: 'password',
        client_id: 'urn:mace:oidc:sampleapp.com',
        scope: 'openid',
        username,
        password
      })
    );
    parseResult(this, result);
    this.__accessToken = this.responseBody.access_token;
    this.__idToken = this.responseBody.id_token;
  }

  async __getUserIdToImpersonate(userName) {
    if (!this.__accessToken)
      throw new Error('Missing access token, please get access token via getAuthenticateToken method');
    const request = createRestRequestObject(this.getImpersonateUserIdUrl(userName), {
      Authorization: `Bearer ${this.__accessToken}`
    });
    const result = await request.get();
    parseResult(this, result);
    this.__userId = this.responseBody[0].id;
  }

  async __getIdToken() {
    const request = createRestRequestObject(this.authenticateUrl, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const result = await request.post(
      '/auth/realms/sampleapp/protocol/openid-connect/token',
      stringifyFormUrlencodedData({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        client_id: 'urn:mace:oidc:sampleapp.com',
        requested_subject: this.__userId,
        subject_token: this.__accessToken
      })
    );
    parseResult(this, result);
    const token = this.responseBody;
    return token.access_token;
  }
}

exports.Authenticate = Authenticate;
