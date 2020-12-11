/* eslint-disable global-require,max-len,no-undef, no-empty */
delete require.cache[require.resolve('../../helper/runner.helper')];
let { ConfigHelper } = require('../../helper/config.helper');
let { RunnerHelper } = require('../../helper/runner.helper');
const fs = require('fs');
const { ServiceConfig } = require('../../config/service/service.config');
const { assert } = require('chai');
const sinon = require('sinon');
const path = require('path');

const testConfigFile = path.join(path.resolve(__dirname), 'unittest.config.json');

const stubListFile = ['a.js', 'b.json', 'c.txt', 'd.log', 'e.js'];
const stubConfigData = {
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
  timeout: 1000,
};

describe('Unit Test runner.helper.js', function s() {
  let sandbox = sinon.createSandbox();
  let stub = {};
  before(function setUpSuite() {
    // Stub test data
    fs.writeFileSync(testConfigFile, JSON.stringify(stubConfigData));
  });

  after(function cleanSuite() {
    fs.unlinkSync(testConfigFile);
    delete require.cache[require.resolve('../../helper/runner.helper')];
  });
  beforeEach(function setUpTest() {
    sandbox = sinon.createSandbox();
    stub = sandbox.stub;
    delete require.cache[require.resolve('../../helper/runner.helper')];
    RunnerHelper = require('../../helper/runner.helper').RunnerHelper;
    delete require.cache[require.resolve('../../helper/config.helper')];
    ConfigHelper = require('../../helper/config.helper').ConfigHelper;
    const readdirSyncStub = sandbox.stub(fs, 'readdirSync');
    const statSyncStub = sandbox.stub(fs, 'statSync');
    const readFileSyncStub = sandbox.stub(fs, 'readFileSync');
    readdirSyncStub.withArgs('stubpath').returns(['a.js', 'b.js', 'c']);
    readdirSyncStub.withArgs('stubpath/c').returns(['aa.js', 'bb.js']);
    statSyncStub.withArgs('stubpath/a.js').callsFake(function isDirectory() {
      return { isDirectory: () => false };
    });
    statSyncStub.withArgs('stubpath/b.js').callsFake(function isDirectory() {
      return { isDirectory: () => false };
    });
    statSyncStub.withArgs('stubpath/c').callsFake(function isDirectory() {
      return { isDirectory: () => true };
    });
    statSyncStub.withArgs('stubpath/c/aa.js').callsFake(function isDirectory() {
      return { isDirectory: () => false };
    });
    statSyncStub.withArgs('stubpath/c/bb.js').callsFake(function isDirectory() {
      return { isDirectory: () => false };
    });
    readFileSyncStub
      .withArgs('stubpath/a.js')
      .returns("\nexports.TAGS = ['A', 'Tag With Space', 'P1'];");
    readFileSyncStub.withArgs('stubpath/b.js').returns("\nexports.TAGS = ['B'];");
    readFileSyncStub.withArgs('stubpath/c/aa.js').returns("\nexports.TAGS = ['C', 'P1'];");
    readFileSyncStub.withArgs('stubpath/c/bb.js').returns('\nnothing inside file');
    readFileSyncStub.withArgs(testConfigFile).returns(JSON.stringify(stubConfigData));
    readFileSyncStub.withArgs('debug.config.json').returns(JSON.stringify(stubConfigData));
  });
  afterEach(function resetSandbox() {
    // Restore all the things made through the sandbox
    sandbox.restore();
  });

  it('Test can set appRootPath', function t() {
    RunnerHelper.appRootPath = 'Stub';
    assert.equal('Stub', RunnerHelper.appRootPath, 'Error in set appRootPath');
  });

  it('Test cannot set appRootPath twice', function t() {
    RunnerHelper.appRootPath = 'Stub';
    RunnerHelper.appRootPath = 'Another Stub';
    assert.equal('Stub', RunnerHelper.appRootPath, 'Error in set appRootPath');
  });

  it('Test can set testFolderPath', function t() {
    RunnerHelper.testFolderPath = 'Stub';
    assert.equal('Stub', RunnerHelper.testFolderPath, 'Error in set appRootPath');
  });

  it('Test cannot set testFolderPath twice', function t() {
    RunnerHelper.testFolderPath = 'Stub';
    RunnerHelper.testFolderPath = 'Another Stub';
    assert.equal('Stub', RunnerHelper.testFolderPath, 'Error in set appRootPath');
  });

  it('Test can set restServiceConfigFilePath', function t() {
    RunnerHelper.restServiceConfigFilePath = 'Stub';
    assert.equal('Stub', RunnerHelper.restServiceConfigFilePath, 'Error in set appRootPath');
  });

  it('Test cannot set restServiceConfigFilePath twice', function t() {
    RunnerHelper.restServiceConfigFilePath = 'Stub';
    RunnerHelper.restServiceConfigFilePath = 'Another Stub';
    assert.equal('Stub', RunnerHelper.restServiceConfigFilePath, 'Error in set appRootPath');
  });

  it('Test get serviceConfig from raw JSON', function t() {
    const config = RunnerHelper.getServiceConfigFromJson({ a: 1111 });
    assert.instanceOf(config, ServiceConfig, 'Error in create service config from raw JSON');
  });

  it('Test cannot set serviceConfig from raw JSON twice', function t() {
    const configFirst = RunnerHelper.getServiceConfigFromJson({ a: 11 });
    const configSecond = RunnerHelper.getServiceConfigFromJson({ a: 22 });
    assert.instanceOf(configFirst, ServiceConfig, 'Error in create service config from raw JSON');
    assert.instanceOf(configSecond, ServiceConfig, 'Error in create service config from raw JSON');
    assert.equal(
      configFirst.getConfigData('a'),
      configSecond.getConfigData('a'),
      'Error in persitent service config from raw JSON'
    );
  });

  it('Test can set authenticate username', function t() {
    RunnerHelper.authenticateUserName = 'a';
    assert.equal(RunnerHelper.authenticateUserName, 'a', 'Error in set authenticate username');
  });

  it('Test cannot set authenticate username twice', function t() {
    ConfigHelper.restAuthenticateUserName = 'a';
    ConfigHelper.restAuthenticateUserName = 'b';
    assert.equal(
      ConfigHelper.restAuthenticateUserName,
      'a',
      'Error in persitent authenticate username'
    );
  });

  it('Test can set authenticate password', function t() {
    RunnerHelper.authenticatePassword = 'a';
    assert.equal(RunnerHelper.authenticatePassword, 'a', 'Error in set authenticate username');
  });

  it('Test cannot set authenticate password twice', function t() {
    ConfigHelper.restAuthenticatePassword = 'a';
    ConfigHelper.restAuthenticatePassword = 'b';
    assert.equal(
      ConfigHelper.restAuthenticatePassword,
      'a',
      'Error in persitent authenticate username'
    );
  });

  it('Test can get  serviceConfigDebug without configPath', function t() {
    const runnerHelperSpy = sandbox.spy(RunnerHelper, 'getDebugModeConfig');
    const pathJoinStub = sandbox.stub(path, 'join');
    pathJoinStub.returns('debug.config.json');
    const config = RunnerHelper.getServiceConfig();
    assert.equal(runnerHelperSpy.calledOnce, true, 'Error in get debug config');
    assert.instanceOf(config, ServiceConfig, 'Error in create service config from debug config');
  });

  it('Test throw exception if get serviceConfig without restServiceConfigFilePath and debug.config.json', function t() {
    const pathJoinStub = stub(path, 'join');
    pathJoinStub.returns('nothing.file.json');
    const config = () => {
      return RunnerHelper.getServiceConfig();
    };
    assert.throws(
      config,
      Error,
      'Missing debug.config.json file in config folder',
      'Error in throw exception when missing debug.config.json in get ServiceConfig'
    );
  });

  it('Test can get serviceConfig restServiceConfigFilePath', function t() {
    RunnerHelper.restServiceConfigFilePath = testConfigFile;
    const config = RunnerHelper.getServiceConfig();
    assert.instanceOf(config, ServiceConfig, 'Error in get ServiceConfig');
    assert.equal(config.baseUrl, stubConfigData.baseUrl, 'Error in get ServiceConfig');
  });

  it('Test can check object contain method', function t() {
    const StubObject = function Stub() {};
    StubObject.prototype.test = 1;
    const actualValue = RunnerHelper.isContainMethod(new StubObject(), 'test');
    assert.equal(actualValue, true, 'Has error in check object contains method');
  });

  it('Test can filter file by extension name', async function t() {
    const listFiles = RunnerHelper.filterFileByExtension(stubListFile, '.js');
    assert.deepEqual(listFiles, ['a.js', 'e.js'], 'Error in filter file by extension');
  });

  it('Test can get all files in folder', async function t() {
    // Arrange
    const listActualFiles = [];
    // Act
    RunnerHelper.getAllFileInFolder('stubpath', listActualFiles);
    // Assert
    assert.deepEqual(listActualFiles, [
      'stubpath/a.js',
      'stubpath/b.js',
      'stubpath/c/aa.js',
      'stubpath/c/bb.js',
    ]);
  });

  it('Test can get all files by it tags data inside and test without tag data', async function t() {
    const listTestFiles = [];
    const actualTestFiles = RunnerHelper.filterFileByExtensionAndTag(
      'stubpath',
      ['A'],
      '.js',
      listTestFiles
    );
    assert.deepEqual(actualTestFiles, ['stubpath/a.js', 'stubpath/c/bb.js']);
  });

  it('Test can get all files if run without tag', async function t() {
    const listTestFiles = [];
    const actualTestFiles = RunnerHelper.filterFileByExtensionAndTag(
      'stubpath',
      [],
      '.js',
      listTestFiles
    );
    assert.deepEqual(actualTestFiles, [
      'stubpath/a.js',
      'stubpath/b.js',
      'stubpath/c/aa.js',
      'stubpath/c/bb.js',
    ]);
  });

  it('Test can get all files by tag has space inside data inside ', async function t() {
    const listTestFiles = [];
    const actualTestFiles = RunnerHelper.filterFileByExtensionAndTag(
      'stubpath',
      ['Tag With Space'],
      '.js',
      listTestFiles
    );
    assert.deepEqual(actualTestFiles, ['stubpath/a.js', 'stubpath/c/bb.js']);
  });

  it('Test can get all files by tag has number inside data inside ', async function t() {
    const listTestFiles = [];
    const actualTestFiles = RunnerHelper.filterFileByExtensionAndTag(
      'stubpath',
      ['P1'],
      '.js',
      listTestFiles
    );
    assert.deepEqual(actualTestFiles, ['stubpath/a.js', 'stubpath/c/aa.js', 'stubpath/c/bb.js']);
  });
});
