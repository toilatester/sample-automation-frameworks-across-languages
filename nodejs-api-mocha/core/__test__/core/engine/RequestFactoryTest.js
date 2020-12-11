/* eslint-disable global-require,max-len,no-undef, no-empty */
delete require.cache[require.resolve('../../../helper/runner.helper')];
const { REQUEST_SERVICE } = require('../../../engine/request.factory');
const { ServiceConfig, SftpConfig } = require('../../../config/service');
const { ConfigHelper } = require('../../../helper/config.helper');
const { RestRequest, WebSocketRequest, SftpRequest } = require('../../../engine/request');
const { assert } = require('chai');
const sinon = require('sinon');

const stubEdiData = {
  host: 'ec2-18-222-34-184.us-east-2.compute.amazonaws.com',
  port: '22',
  protocol: 'sftp',
  ediRemoteDirectory: '/root/Team5/',
  ediXmlLocalFolder: 'data/edixml',
};

const stubData = {
  anotherKeyDefault: null,
  anotherKey: 'anotherKey',
  loginDomain: 'loginDomain',
  env: 'env',
  namespace: 'namespace',
  baseUrl: 'baseUrl',
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
  authenticate: {
    username: 'username',
    password: 'password',
  },
  timeout: 1,
};

describe('Unit Test for request.factory.js', function suite() {
  let sandbox = sinon.createSandbox();
  after(function cleanSuite() {
    delete require.cache[require.resolve('../../../helper/runner.helper')];
    delete require.cache[require.resolve('../../../engine')];
    delete require.cache[require.resolve('../../../engine/request.factory')];
    delete require.cache[require.resolve('../../../engine/request/base.request')];
    delete require.cache[require.resolve('../../../engine/request/rest.request')];
    delete require.cache[require.resolve('./RequestFactoryTest')];
  });
  beforeEach('set up sandbox', function clean() {
    delete require.cache[require.resolve('../../../helper/runner.helper')];
    RunnerHelper = require('../../../helper/runner.helper').RunnerHelper;
    sandbox = sinon.createSandbox();
  });
  afterEach('Clean sandbox', function clean() {
    sandbox.restore();
  });
  it('Can get Rest Request Service', function t() {
    const rest = REQUEST_SERVICE.REST_SERVICE(stubData);
    assert.instanceOf(rest, RestRequest, 'Error in create RestRequest Service');
  });

  it('Can get authdomain Rest Request Service', function t() {
    const rest = REQUEST_SERVICE.authdomain_SERVICE(new ServiceConfig(stubData, false));
    assert.instanceOf(rest, RestRequest, 'Error in create RestRequest Service');
    assert.equal(rest.baseUrl, stubData.authdomainUrl, 'Error in create RestRequest Service');
  });

  it('Can get INVENTORY Rest Request Service', function t() {
    const rest = REQUEST_SERVICE.INVENTORY_SERVICE(new ServiceConfig(stubData, false));
    assert.instanceOf(rest, RestRequest, 'Error in create RestRequest Service');
    assert.equal(rest.baseUrl, stubData.baseInvUrl, 'Error in create RestRequest Service');
  });

  it('Can get VENDOR Rest Request Service', function t() {
    const rest = REQUEST_SERVICE.VENDOR_SERVICE(new ServiceConfig(stubData, false));
    assert.instanceOf(rest, RestRequest, 'Error in create RestRequest Service');
    assert.equal(rest.baseUrl, stubData.vendorUrl, 'Error in create RestRequest Service');
  });

  it('Can get RECIPE Rest Request Service', function t() {
    const rest = REQUEST_SERVICE.RECIPE_SERVICE(new ServiceConfig(stubData, false));
    assert.instanceOf(rest, RestRequest, 'Error in create RestRequest Service');
    assert.equal(rest.baseUrl, stubData.baseRecipeUrl, 'Error in create RestRequest Service');
  });

  it('Can get WEBSOCKET Rest Request Service', function t() {
    const socket = REQUEST_SERVICE.SOCKET_SERVICE(new ServiceConfig(stubData, false));
    assert.instanceOf(socket, WebSocketRequest, 'Error in create RestRequest Service');
  });

  it('Can get sftp Rest Request Service', function t() {
    ConfigHelper.sftpAuthenticateUserName = 'stubusername';
    ConfigHelper.sftpAuthenticatePassword = 'stubpassword';
    const sftp = REQUEST_SERVICE.SFTP_SERVICE(new SftpConfig(stubEdiData, false));
    assert.instanceOf(sftp, SftpRequest, 'Error in create RestRequest Service');
  });
});
