/* eslint-disable global-require,max-len,no-undef */
delete require.cache[require.resolve('../../helper/runner.helper')];
delete require.cache[require.resolve('../../helper/report.helper')];
// delete require.cache[require.resolve('../../helper/config.helper')];
const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const { ServiceConfig } = require('../../config/service/service.config');
const { ConfigHelper } = require('../../helper/config.helper');

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
  timeout: 1000,
};

const stubDataWithoutEnv = {
  anotherKeyDefault: null,
  anotherKey: 'anotherKey',
  loginDomain: 'loginDomain',
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
  timeout: 1000,
};
const { assert } = chai;
const StubConfigData = {
  readFileSync: () => {
    return JSON.stringify(stubData);
  },
};

const StubConfigDataWithoutEnv = {
  readFileSync: () => {
    return JSON.stringify(stubDataWithoutEnv);
  },
};

describe('Unit Test for service.config.js', function suite() {
  const instanceConfig = () => {
    const config = new ServiceConfig(true);
    return config;
  };
  let sandbox = sinon.createSandbox();
  after(function cleanSuite() {
    delete require.cache[require.resolve('../../helper/runner.helper')];
    delete require.cache[require.resolve('../../helper/report.helper')];
    // delete require.cache[require.resolve('../../helper/config.helper')];
  });
  beforeEach(function setUpTest() {
    sandbox = sinon.createSandbox();
  });
  afterEach(function resetSandbox() {
    // Restore all the things made through the sandbox
    fs.readFileSync.restore();
    sandbox.restore();
  });

  it('Service Can Parse Correct Config Data', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.instanceOf(config, ServiceConfig, 'Cannot parsing config file');
  });

  it('Service Can Catch ENOENT Exception Correct Config Data', function t() {
    const exception = new Error('ENOENT');
    exception.code = 'ENOENT';
    sinon.stub(fs, 'readFileSync').throws(exception);
    assert.throw(instanceConfig, Error);
  });

  it('Service Can Catch Syntax Exception Correct Config Data', function t() {
    const syntaxError = new SyntaxError('Stub Exception');
    sinon.stub(fs, 'readFileSync').throws(syntaxError);
    assert.throw(instanceConfig, Error);
  });

  it('Service Can Catch Other Exception Correct Config Data', function t() {
    const otherError = new Array('Stub Exception');
    sinon.stub(fs, 'readFileSync').throws(otherError);
    assert.throw(instanceConfig, Error);
  });

  it('Service Can Get Correct Config Data Again', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const configObject = instanceConfig();
    const config2 = new ServiceConfig(configObject, false);
    assert.equal(config2.baseauthdomainUrl, stubData.authdomainUrl, 'Cannot parsing config file');
  });

  it('Service Can Get Correct Config baseauthdomainUrl Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.baseauthdomainUrl,
      stubData.authdomainUrl,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct Config InventoryUrl Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.baseInventoryUrl,
      stubData.baseInvUrl,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct Config VendorUrl Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.baseVendorUrl,
      stubData.vendorUrl,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct Config baseRecipeUrl Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.baseRecipeUrl,
      stubData.baseRecipeUrl,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct Config baseUrl Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.baseUrl, stubData.baseUrl, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct Config cookieManager Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.cookieManager,
      stubData.cookieManager,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct Config env Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.env, stubData.env, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct Config host Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.host, stubData.host, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct loginDomain Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.loginDomain,
      stubData.loginDomain,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct namespace Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.namespace, stubData.namespace, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct port Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.port, stubData.port, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct protocol Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.protocol, stubData.protocol, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct securityMethod Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.securityMethod,
      stubData.securityMethod,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct storeKeys Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.deepEqual(
      config.storeKeys,
      stubData.storeKeys,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct timeout Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.timeout, stubData.timeout, 'Cannot parse correctly value config file');
  });

  it('Service Can Get Correct another Data Value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.getConfigData('anotherKey'),
      stubData.anotherKey,
      'Cannot parse correctly value config file'
    );
  });

  it('Service Can Get Correct another Data Value with default value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    assert.equal(
      config.getConfigData('anotherKeyDefault', 'anotherKeyDefault'),
      'anotherKeyDefault',
      'Cannot parse correctly value config file'
    );
  });

  it('Service throw error another Data Value without default value', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    const getData = () => {
      config.getConfigData('anotherKeyDefault');
    };
    assert.throws(getData, Error);
  });

  it('Service throw error invalid key', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = instanceConfig();
    const getData = () => {
      config.getConfigData('invalidKey');
    };
    assert.throws(getData, Error);
  });

  it('Service can get raw json config', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = new ServiceConfig({ a: 1, b: 2 }, false);
    assert.equal(config.getConfigData('a'), 1);
  });

  it('Service can get raw json config', function t() {
    sinon.stub(fs, 'readFileSync').returns(StubConfigData.readFileSync(true));
    const config = new ServiceConfig({ a: 1, b: 2 }, false);
    assert.equal(config.getConfigData('a'), 1);
  });

  it('Service can get env value without json config', function t() {
    ConfigHelper.environment = 'qastub';
    sinon.stub(fs, 'readFileSync').returns(StubConfigDataWithoutEnv.readFileSync(true));
    const config = instanceConfig();
    assert.equal(config.env, 'qastub');
  });
});
