/* eslint-disable global-require,max-len,no-undef, no-empty, no-console */
let { REQUEST_SERVICE } = require('../../../engine/request.factory');
let { RestRequest } = require('../../../engine/request');
const { ServiceConfig } = require('../../../config/service/service.config');
let { ConfigHelper } = require('../../../helper/config.helper');
const { default: axios } = require('axios');
const { assert } = require('chai');
const { Log4jsReportPortal } = require('../../../report/log4js');
const { Log4jsConfig } = require('../../../config/log4js');
const { LoggerManager } = require('../../../log/logger');
let { AbstractRequest } = require('../../../engine/request/base.request');
const log4js = require('log4js');
const sinon = require('sinon');
const nock = require('nock');

ConfigHelper.restAuthenticateUserName = 'username';
ConfigHelper.restAuthenticatePassword = 'password';
let actualRequestParam = [];
const stubDataTest = {
  anotherKeyDefault: null,
  anotherKey: 'anotherKey',
  loginDomain: 'loginDomain',
  env: 'env',
  namespace: 'namespace',
  baseUrl: 'http://localhost',
  baseAppUrl: 'baseAppUrl',
  baseInvUrl: 'baseInvUrl',
  baseProdUrl: 'baseProdUrl',
  baseRecipeUrl: 'baseRecipeUrl',
  authdomainUrl: 'authdomainUrl',
  vendorUrl: 'vendorUrl',
  storeKey: 'storeKey',
  storeKeys: ['storeKeys', 'storeKeys', 'storeKeys'],
  cookieManager: 'cookieManager',
  securityMethod: 'securityMethod',
  host: 'host',
  port: 'port',
  protocol: 'protocol',
  timeout: 500,
  impersonateUserName: 'impersonateUserName',
};
const stubGetMethod = (...args) => {
  actualRequestParam = args;
  return {
    headers: { headers: 'headers' },
    request: { _header: { cookie: 12 } },
    config: { url: 'stub url', headers: { response: '12v' } },
    data: [
      {
        id: 1,
        status: 100,
        statusText: 'sample',
        id_token: 6969,
        expires_in: 2,
      },
    ],
  };
};

const expectedHeader = 'ID_TOKEN=6969';
const stubPatchMethod = (...args) => {
  actualRequestParam = args;
  return {
    headers: { headers: 'headers' },
    request: { _header: { cookie: 12 } },
    config: { url: 'stub url', headers: { response: '12v' } },
    data: {
      status: 100,
      statusText: 'sample',
      id_token: 6969,
      expires_in: 1,
    },
  };
};
const stubDeleteMethod = (...args) => {
  actualRequestParam = args;
  return {
    headers: { headers: 'headers' },
    request: { _header: { cookie: 12 } },
    config: { url: 'stub url', headers: { response: '12v' } },
    data: {
      status: 100,
      statusText: 'sample',
      id_token: 6969,
      expires_in: 1,
    },
  };
};

const stubPostMethod = (...args) => {
  actualRequestParam = args;
  return {
    headers: { headers: 'headers' },
    request: { _header: { cookie: 12 } },
    config: { url: 'stub url', headers: { response: '12v' } },
    data: {
      status: 100,
      statusText: 'sample',
      id_token: 6969,
      access_token: 6969,
      expires_in: 1,
    },
  };
};
const stubPutMethod = (...args) => {
  actualRequestParam = args;
  return {
    headers: { headers: 'headers' },
    request: { _header: { cookie: 12 } },
    config: { url: 'stub url', headers: { response: '12v' } },
    data: {
      status: 100,
      statusText: 'sample',
      id_token: 6969,
      expires_in: 1,
    },
  };
};

const stubRequestHasError = () => {
  const error = new Error();
  error.response = {
    data: 'Stub to check log data',
    headers: { headers: 'headers' },
    request: { _header: { cookie: 12 } },
    config: { url: 'stub url', headers: { response: '12v' } },
    status: 100,
    statusText: 'sample',
    id_token: 6969,
    expires_in: 1,
  };
  throw error;
};

const mockAuthenticateService = () => {
  nock('https://login.sample-auth.io:443')
    .log(console.log)
    .post(
      '/auth/realms/sample/protocol/openid-connect/token',
      'grant_type=password&client_id=urn%3Amace%3Aoidc%3Asampleapp.com&scope=openid&username=username&password=password'
    )
    .reply(200, {
      headers: { headers: 'headers' },
      request: { _header: { cookie: 12 } },
      config: { url: 'stub url', headers: { response: '12v' } },
      id_token: 6969,
      access_token: 6969,
      data: {
        status: 100,
        statusText: 'sample',
        access_token: 6969,
        id_token: 6969,
        expires_in: 6969,
      },
    });
};

const mockAuthenticateServiceGetTokenAdmin = () => {
  nock('https://login.sample-auth.io:443')
    .log(console.log)
    .post(
      '/auth/realms/sampleapp/protocol/openid-connect/token',
      'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Atoken-exchange&client_id=urn%3Amace%3Aoidc%3Asampleapp.com&requested_subject=1&subject_token=6969'
    )
    .reply(200, {
      headers: { headers: 'headers' },
      request: { _header: { cookie: 12 } },
      config: { url: 'stub url', headers: { response: '12v' } },
      id_token: 6969,
      access_token: 6969,
      data: {
        status: 100,
        statusText: 'sample',
        id_token: 6969,
        expires_in: 6969,
      },
    });
};

const mockGetImpersonateUserId = () => {
  nock('https://login.sample-auth.io/auth/admin/realms/sampleapp')
    .log(console.log)
    .get('/users')
    .query({ max: 25, search: 'impersonateUserName', first: 0 })
    .reply(200, [
      {
        id: 1,
        status: 100,
        statusText: 'sample',
        id_token: 6969,
        expires_in: 2,
      },
    ]);
};

const mockGetService = (path = '') => {
  nock('http://localhost').log(console.log).get(`/namespace/${path}`).reply(200, {
    stub: 'stub response data',
  });
};
describe('Unit Test for rest.request.js', function suite() {
  let sandbox = sinon.createSandbox();
  let axiosRequestStub = {};
  let infoSpy = sandbox.spy();
  let log4jsConfigureSpy = {};
  // // Make sure log4js.getLogger() returns an object containing our spy.
  let loggerManagerInfoStub = {};
  let loggerManagerErrorStub = {};

  after(function cleanSuite() {
    sandbox.restore();
    nock.cleanAll();
    nock.enableNetConnect();
  });
  beforeEach('set up sandbox', function clean() {
    delete require.cache[require.resolve('../../../engine/request')];
    delete require.cache[require.resolve('../../../engine/request/base.request')];
    delete require.cache[require.resolve('../../../engine/request.factory')];
    delete require.cache[require.resolve('../../../engine/request/base.request')];
    delete require.cache[require.resolve('../../../engine/request/rest.request')];
    delete require.cache[require.resolve('../../../helper/config.helper')];
    REQUEST_SERVICE = require('../../../engine/request.factory').REQUEST_SERVICE;
    RestRequest = require('../../../engine/request').RestRequest;
    AbstractRequest = require('../../../engine/request/base.request').AbstractRequest;
    RunnerHelper = require('../../../helper/runner.helper').RunnerHelper;
    ConfigHelper = require('../../../helper/config.helper').ConfigHelper;
    sandbox = sinon.createSandbox();
    infoSpy = sandbox.spy();
    log4jsConfigureSpy = sandbox.spy(log4js, 'configure');
    // // Make sure log4js.getLogger() returns an object containing our spy.
    loggerManagerInfoStub = sandbox.stub(LoggerManager, 'info');
    loggerManagerErrorStub = sandbox.stub(LoggerManager, 'error');
    loggerManagerInfoStub.callsFake(infoSpy);
    loggerManagerErrorStub.callsFake(infoSpy);
    axiosRequestStub = sandbox.stub(axios, 'create');
    axiosRequestStub.returns({
      patch: stubPatchMethod,
      delete: stubDeleteMethod,
      put: stubPutMethod,
      post: stubPostMethod,
      get: stubGetMethod,
    });
  });

  afterEach('Clean sandbox', function clean() {
    infoSpy.resetHistory();
    log4jsConfigureSpy.resetHistory();
    sandbox.restore();
  });

  it('Test can create request object with default empty', function t() {
    sandbox.restore();
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const requestObject = request.requestObject;
    assert.hasAnyKeys(
      requestObject,
      'request',
      'delete',
      'get',
      'head',
      'options',
      'post',
      'put',
      'patch:'
    );
  });

  it('Test can create request object with otions', function t() {
    sandbox.restore();
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const requestObject = request.createRestRequestObject(
      'stub',
      {
        stub: 'stubheader',
      },
      100
    );
    assert.hasAnyKeys(
      requestObject,
      'request',
      'delete',
      'get',
      'head',
      'options',
      'post',
      'put',
      'patch'
    );
    assert.equal(
      requestObject.defaults.timeout,
      100,
      'Error in config create request object timeout'
    );
    assert.equal(
      requestObject.defaults.baseURL,
      'stub',
      'Error in config create request object baseUrl'
    );
    assert.equal(
      requestObject.defaults.headers.stub,
      'stubheader',
      'Error in config create request object baseUrl'
    );
  });

  it('Test cannot set timeout with negative number', function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    request.requestTimeout = -1;
    assert.equal(
      request.requestTimeout === stubDataTest.timeout,
      true,
      'Error in set timeout, it should not allow set timeout with negative number'
    );
  });

  it('Test can set timeout with positive number', function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    request.requestTimeout = 500;
    assert.equal(
      request.requestTimeout,
      500,
      'Error in set timeout, it should allow set timeout with positive number'
    );
  });

  it('Test can set default data', function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const expectedData = { stub: 'stub default data' };
    request.defaultData = expectedData;
    assert.equal(
      request.data,
      expectedData,
      'Error in set default data, it should allow set default data'
    );
  });

  it('Test can not set default data with invalid data', function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const expectedData = { stub: 'stub default data' };
    request.defaultData = expectedData;
    request.defaultData = undefined;
    assert.equal(
      request.data,
      expectedData,
      'Error in set default data, it should not allow set timeout with invalid data (null,undefined)'
    );
  });

  it('Test can get response data', function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const expectedData = { data: 'stub default data', status: 200 };
    request.parseResult(expectedData);
    assert.equal(
      request.responseBody,
      expectedData.data,
      'Error in set default data, it should allow return response data'
    );
  });

  it('Test can get response code', function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const expectedData = { data: 'stub default data', status: 200 };
    request.parseResult(expectedData);
    assert.equal(
      request.responseCode,
      expectedData.status,
      'Error in set default data, it should allow return response code'
    );
  });

  it('Test can cache cookie after authenticate', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const postData = {
      key1: 'data send',
      key2: 'data send',
      key3: {
        innerKey: [1, 2, 3],
      },
    };
    await request.post({
      path: 'abc/abc/xyz',
      data: postData,
      headers: { CookieStubTest: 'stubCookie' },
    });
    await request.post({
      path: 'abc/abc/xyz',
      data: postData,
      headers: { CookieStubTest: 'stubCookie' },
    });
    assert.equal(axiosRequestStub.callCount, 5, 'Error in send authenticate request');
  });

  it('Test can call get request with correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.get({
      path: 'abc/abc/xyz',
      params: [1, 2, 3, 'queryString'],
      headers: { CookieStubTest: 'stubCookie' },
    });
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/abc/abc/xyz', 'Error in transform URL request');
    assert.hasAnyKeys(
      actualRequestParam[1].headers,
      'CookieStubTest',
      'Error in transform headers request'
    );
    assert.deepEqual(
      actualRequestParam[1].params,
      [1, 2, 3, 'queryString'],
      'Error in transform get param request'
    );
    assert.include(
      actualRequestParam[1].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call get request with empty param and get correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.get();
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/', 'Error in transform URL request');
    assert.hasAnyKeys(
      actualRequestParam[1].headers,
      'securityMethod',
      'Error in transform headers request'
    );
    assert.deepEqual(actualRequestParam[1].params, {}, 'Error in transform get param request');
    assert.include(
      actualRequestParam[1].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call post request with correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const postData = {
      key1: 'data send',
      key2: 'data send',
      key3: {
        innerKey: [1, 2, 3],
      },
    };
    await request.post({
      path: 'abc/abc/xyz',
      data: postData,
      headers: { CookieStubTest: 'stubCookie' },
    });
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/abc/abc/xyz', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], postData, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'CookieStubTest',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call post request with empty param and get correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.post();
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], {}, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'securityMethod',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call delete request with correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const postData = {
      key1: 'data send',
      key2: 'data send',
      key3: {
        innerKey: [1, 2, 3],
      },
    };
    await request.delete({
      path: 'abc/abc/xyz',
      data: postData,
      headers: { CookieStubTest: 'stubCookie' },
    });
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/abc/abc/xyz', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], postData, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'CookieStubTest',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call delete request with empty param and get correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.delete();
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], {}, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'securityMethod',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call put request with correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const postData = {
      key1: 'data send',
      key2: 'data send',
      key3: {
        innerKey: [1, 2, 3],
      },
    };
    await request.put({
      path: 'abc/abc/xyz',
      data: postData,
      headers: { CookieStubTest: 'stubCookie' },
    });
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/abc/abc/xyz', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], postData, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'CookieStubTest',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call put request with empty param and get correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));

    await request.put();
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], {}, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'securityMethod',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call patch request with correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    const postData = {
      key1: 'data send',
      key2: 'data send',
      key3: {
        innerKey: [1, 2, 3],
      },
    };
    await request.patch({
      path: 'abc/abc/xyz',
      data: postData,
      headers: { CookieStubTest: 'stubCookie' },
    });
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/abc/abc/xyz', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], postData, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'CookieStubTest',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call patch request with empty param and get correct param', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.patch();
    assert.equal(axiosRequestStub.callCount, 4, 'Error in send authenticate request');
    assert.equal(actualRequestParam[0], 'namespace/', 'Error in transform URL request');
    assert.deepEqual(actualRequestParam[1], {}, 'Error in transform post data request');
    assert.hasAnyKeys(
      actualRequestParam[2].headers,
      'securityMethod',
      'Error in transform headers request'
    );
    assert.include(
      actualRequestParam[2].headers.securityMethod,
      expectedHeader,
      'Error in create cookie token'
    );
  });

  it('Test can call send request with null namespace', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    request.namespace = null;
    await request.get({
      path: 'abc/abc/xyz',
      params: [1, 2, 3, 'queryString'],
      headers: { CookieStubTest: 'stubCookie' },
    });

    assert.equal(actualRequestParam[0], 'abc/abc/xyz', 'Error in transform URL request');
  });

  it('Test can call send request with null namespace', async function t() {
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.get({
      path: '/abc/abc/xyz',
      params: [1, 2, 3, 'queryString'],
      headers: { CookieStubTest: 'stubCookie' },
    });

    assert.equal(actualRequestParam[0], 'namespace/abc/abc/xyz', 'Error in transform URL request');
  });

  it('Test can get error log with error request', async function t() {
    // Arrange
    const appender = new Log4jsReportPortal({});
    exports.configure = appender.configure;
    Log4jsConfig('logs');
    axiosRequestStub.returns({
      post: stubPostMethod,
      get: stubGetMethod,
      put: stubRequestHasError,
    });
    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    // Act
    await request.get();
    await request.put();
    // Assert
    assert.deepEqual(
      infoSpy.lastCall.args,
      [null, 'Response Body Data: ', '"Stub to check log data"'],
      'Error in log detail error in send request'
    );
    assert.deepEqual(
      infoSpy.firstCall.args,
      [null, 'Error Request: '],
      'Error in log detail error in send request'
    );
  });

  it('Test can send get request', async function t() {
    sandbox.restore();
    mockAuthenticateService();
    mockGetImpersonateUserId();
    mockAuthenticateServiceGetTokenAdmin();
    mockGetService();

    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.get();
    assert.equal(request.responseBody.stub, 'stub response data');
    assert.equal(request.responseCode, 200);
  });

  it('Test can send get request with path', async function t() {
    sandbox.restore();
    mockAuthenticateService();
    mockGetImpersonateUserId();
    mockAuthenticateServiceGetTokenAdmin();
    mockGetService('path');

    const request = REQUEST_SERVICE.REST_SERVICE(new ServiceConfig(stubDataTest, false));
    await request.get({ path: 'path' });
    assert.equal(request.responseBody.stub, 'stub response data');
    assert.equal(request.responseCode, 200);
  });

  it('Test cannot get request object from abstract request', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    assert.throws(() => instnace.getRequestObject, Error, 'NotImplementedError');
  });

  it('Test cannot get request object from abstract request', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    assert.throws(() => instnace.getRequestObject, Error, 'NotImplementedError');
  });

  it('Test can create request object from abstract request without config constructor', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService();
    const requestObject = instnace.createRestRequestObject();
    assert.hasAnyKeys(requestObject, 'delete', 'get', 'head', 'options', 'post', 'put', 'patch:');
  });

  it('Test can create rest request object from abstract request without config constructor', function t() {
    const instnace = new RestRequest();
    const requestObject = instnace.createRestRequestObject();
    assert.hasAnyKeys(requestObject, 'delete', 'get', 'head', 'options', 'post', 'put', 'patch:');
  });

  it('Test can create request object with default empty', function t() {
    sandbox.restore();
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    const requestObject = instnace.restRequestObject;
    assert.hasAnyKeys(
      requestObject,
      'request',
      'delete',
      'get',
      'head',
      'options',
      'post',
      'put',
      'patch:'
    );
  });

  it('Test can create request object with otions', function t() {
    sandbox.restore();
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    const requestObject = instnace.createRestRequestObject(
      'stub',
      {
        stub: 'stubheader',
      },
      100
    );
    assert.hasAnyKeys(
      requestObject,
      'request',
      'delete',
      'get',
      'head',
      'options',
      'post',
      'put',
      'patch'
    );
    assert.equal(
      requestObject.defaults.timeout,
      100,
      'Error in config create request object timeout'
    );
    assert.equal(
      requestObject.defaults.baseURL,
      'stub',
      'Error in config create request object baseUrl'
    );
    assert.equal(
      requestObject.defaults.headers.stub,
      'stubheader',
      'Error in config create request object baseUrl'
    );
  });

  it('Test can get properties data from abstract request', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    instnace.defaultData = { a: '123' };
    assert.equal(instnace.requestTimeout, stubDataTest.timeout);
    assert.deepEqual(instnace.data, { a: '123' });
  });

  it('Test cannot set timeout with negative number abstract request', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    instnace.requestTimeout = -1;
    assert.equal(
      instnace.requestTimeout === stubDataTest.timeout,
      true,
      'Error in set timeout, it should not allow set timeout with negative number  abstract request'
    );
  });

  it('Test can set timeout with positive number', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    instnace.requestTimeout = 500;
    assert.equal(
      instnace.requestTimeout,
      500,
      'Error in set timeout, it should allow set timeout with positive number'
    );
  });

  it('Test can return response data with error request from abstract request', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    instnace.parseResult({});
    assert.equal(
      instnace.responseBody,
      'Error in send request. Access rawResponseBody property for more details',
      'Error in parsing error request'
    );
    assert.equal(instnace.responseCode, -1, 'Error in parsing error request');
  });

  it('Test can return response data with catch error request from abstract request', function t() {
    const instnace = new AbstractRequest();
    instnace.initConfigService(stubDataTest);
    instnace.parseResult(null);
    assert.equal(
      instnace.responseBody,
      'Error in send request. Access rawResponseError property for more details',
      'Error in parsing error request'
    );
    assert.equal(instnace.responseCode, -1, 'Error in parsing error request');
  });
});
