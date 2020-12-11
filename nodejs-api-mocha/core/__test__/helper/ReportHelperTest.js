/* eslint-disable global-require,max-len,no-undef, no-empty */
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
let { ReportHelper } = require('../../helper/report.helper');
const { assert } = require('chai');
const { default: axios } = require('axios');
const { ReportPortalAgent } = require('../../report/report-portal/core/ReportPortalAgent');

const stubConfigData = {
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
  authenticate: {
    username: 'username',
    password: 'password',
  },
  timeout: 500,
};

describe('Unit test report.helper.js', function s() {
  let sandbox = sinon.createSandbox();
  after(function cleanSuite() {
    delete require.cache[require.resolve('../../helper/runner.helper')];
    delete require.cache[require.resolve('../../helper/report.helper')];
  });
  beforeEach('Set up sandbox', function setUp() {
    sandbox = sinon.createSandbox();
    delete require.cache[require.resolve('../../helper/report.helper')];
    ReportHelper = require('../../helper/report.helper').ReportHelper;
    const readFileSyncStub = sandbox.stub(fs, 'readFileSync');
    const pathJoinStub = sandbox.stub(path, 'join');
    pathJoinStub.returns('debug.config.json');
    readFileSyncStub.withArgs('debug.config.json').returns(JSON.stringify(stubConfigData));
  });

  afterEach('Clean sandbox', function clean() {
    sandbox.restore();
  });

  it('Test can create ReportDescription with data', function t() {
    const description = ReportHelper.createReportDescription(['Test Inject Build', 2, 3, 4, 5]);
    assert.include(description, '** Build Version **', 'Error in generate report description');
    assert.include(description, 'Test Inject Build', 'Error in generate report description');
  });

  it('Test cannot set report agent class twice', async function t() {
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    ReportHelper.reportAgentClass = class StubClass {
      checkConnection() {
        return Promise.resolve(1);
      }
    };
    ReportHelper.reportAgentClass = class B {
      checkConnection() {
        return Promise.resolve(1);
      }
    };
    const agent = await ReportHelper.createReportAgent({ host: 'stub' });
    assert.equal(
      agent.constructor.name === 'StubClass',
      true,
      'Error in protect agent class in singleton mode'
    );
  });

  it('Test can create ReportDescription with empty', function t() {
    assert.doesNotThrow(ReportHelper.createReportDescription, Error);
    assert.include(
      ReportHelper.createReportDescription(),
      '** Build Version **',
      'Error in generate report description'
    );
  });

  it('Test can create ReportPortalMap', function t() {
    const actual = ReportHelper.createReportPortalTag(
      {
        a: 1,
        b: 2,
      },
      ['a', 'b']
    );
    assert.deepEqual(actual, [1, 2]);
  });

  it('Test can create ReportPortalMap with non-exist key', function t() {
    const actual = ReportHelper.createReportPortalTag(
      {
        a: 1,
        b: 2,
      },
      ['a', 'b', 'c']
    );
    assert.deepEqual(actual, [1, 2]);
  });

  it('Test can create ReportPortalMap with invalid rawData', function t() {
    const actual = ReportHelper.createReportPortalTag({}, ['a', 'b', 'c']);
    assert.deepEqual(actual, []);
  });

  it('Test can create ReportPortalMap with invalid key', function t() {
    const actual = ReportHelper.createReportPortalTag(
      {
        a: 1,
        b: 2,
      },
      []
    );
    assert.deepEqual(actual, []);
  });

  it('Test can create ReportPortalMap with empty all args', function t() {
    const actual = ReportHelper.createReportPortalTag();
    assert.deepEqual(actual, []);
  });

  it('Test throw exeception when get ReportAgent without instance', function t() {
    assert.throws(
      ReportHelper.getReportPortalAgent,
      Error,
      'Invalid ReportPortal Key undefined or error in connect to ReportPortal Server',
      'Error in throw exception when ReportPortal is not create'
    );
  });

  it('Test doest not throw exeception when get ReportAgent with valid instance', async function t() {
    ReportHelper.reportAgentClass = class StubClass {
      checkConnection() {
        return true;
      }
    };
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    await ReportHelper.createReportAgent({ host: 'stub' });
    assert.doesNotThrow(
      ReportHelper.getReportPortalAgent,
      Error,
      'Invalid ReportPortal Key undefined or error in connect to ReportPortal Server',
      'Error in get ReportPortal instance'
    );
  });

  it('Test throw exeception when get create report agent when report server turn', async function t() {
    ReportHelper.reportAgentClass = function StubClass() {};
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({
      get: () => {
        throw new Error('Stub ReportPortal Server Is Shutdown');
      },
    });
    try {
      await ReportHelper.createReportAgent({ host: 'stub' });
    } catch (err) {
      assert.instanceOf(err, Error);
      assert.equal(err, 'Error: Error in create ReportAgent Stub ReportPortal Server Is Shutdown');
    }
  });

  it('Test throw exeception when get ReportAgent with invalid key', async function t() {
    ReportHelper.reportAgentClass = class StubClass {
      checkConnection() {
        return true;
      }
    };
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    await ReportHelper.createReportAgent({ host: 'stub' });
    assert.throws(
      () => ReportHelper.getReportPortalAgent('invalidKey'),
      Error,
      'Invalid ReportPortal Key invalidKey or error in connect to ReportPortal Server',
      'Error in get ReportPortal instance'
    );
  });

  it('Test report agent will store with default key when store with empty key', async function t() {
    const stubAgent = new (function StubClass() {})();
    ReportHelper.storeReportPortalAgent(null, stubAgent);
    assert.equal(
      stubAgent,
      ReportHelper.getReportPortalAgent(),
      'Error in store report with default key'
    );
  });

  it('Test get report agent by key', async function t() {
    const stubAgent = new (function StubClass() {})();
    ReportHelper.storeReportPortalAgent('keyvalid', stubAgent);
    assert.equal(
      stubAgent,
      ReportHelper.getAgent('keyvalid'),
      'Error in get report with valid key'
    );
  });

  it('Test can not instance ReportHelper class', async function t() {
    const instanceHelper = () => {
      return new ReportHelper();
    };
    assert.throw(
      instanceHelper,
      Error,
      'Cannot construct singleton',
      'Error in protect singleton class'
    );
  });

  it('Test get default report store key', async function t() {
    assert.equal(ReportHelper.defaultReportStoreKey, 'Default', 'Default key is incorrect');
  });

  it('Test can send start launch request', async function t() {
    // Arrange
    const reportPortalAgentSpy = sandbox.stub(ReportPortalAgent.prototype, 'sendLaunchRequest');
    const agentCheckConnectStub = sandbox.stub(ReportPortalAgent.prototype, 'checkConnection');
    agentCheckConnectStub.returns(true);
    reportPortalAgentSpy.returns({ test: 'test' });
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    // Act
    ReportHelper.reportAgentClass = ReportPortalAgent;
    await ReportHelper.createReportAgent({ host: 'stub' });
    ReportHelper.sendLaunchRequest(ReportHelper.defaultReportStoreKey, {}, true);
    // Assert
    assert.equal(reportPortalAgentSpy.calledOnce, true);
    sandbox.assert.calledWith(reportPortalAgentSpy, {}, true);
  });

  it('Test can send stop launch request', async function t() {
    // Arrange
    const reportPortalAgentSpy = sandbox.stub(ReportPortalAgent.prototype, 'sendLaunchRequest');
    const agentCheckConnectStub = sandbox.stub(ReportPortalAgent.prototype, 'checkConnection');
    agentCheckConnectStub.returns(true);
    reportPortalAgentSpy.returns({ test: 'test' });
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    // Act
    ReportHelper.reportAgentClass = ReportPortalAgent;
    await ReportHelper.createReportAgent({ host: 'stub' });
    ReportHelper.sendLaunchRequest(ReportHelper.defaultReportStoreKey, {}, false);
    // Assert
    assert.equal(reportPortalAgentSpy.calledOnce, true);
    sandbox.assert.calledWith(reportPortalAgentSpy, {}, false);
  });

  it('Test can send start item request', async function t() {
    // Arrange
    const reportPortalAgentSpy = sandbox.stub(ReportPortalAgent.prototype, 'sendTestItemRequest');
    const agentCheckConnectStub = sandbox.stub(ReportPortalAgent.prototype, 'checkConnection');
    agentCheckConnectStub.returns(true);
    reportPortalAgentSpy.returns({ test: 'test' });
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    // Act
    ReportHelper.reportAgentClass = ReportPortalAgent;
    await ReportHelper.createReportAgent({ host: 'stub' });
    ReportHelper.sendTestItemRequest(ReportHelper.defaultReportStoreKey, {}, true);
    // Assert
    assert.equal(reportPortalAgentSpy.calledOnce, true);
    sandbox.assert.calledWith(reportPortalAgentSpy, {}, true);
  });

  it('Test can send stop item request', async function t() {
    // Arrange
    const reportPortalAgentSpy = sandbox.stub(ReportPortalAgent.prototype, 'sendTestItemRequest');
    const agentCheckConnectStub = sandbox.stub(ReportPortalAgent.prototype, 'checkConnection');
    agentCheckConnectStub.returns(true);
    reportPortalAgentSpy.returns({ test: 'test' });
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    // Act
    ReportHelper.reportAgentClass = ReportPortalAgent;
    await ReportHelper.createReportAgent({ host: 'stub' });
    ReportHelper.sendTestItemRequest(ReportHelper.defaultReportStoreKey, {}, false);
    // Assert
    assert.equal(reportPortalAgentSpy.calledOnce, true);
    sandbox.assert.calledWith(reportPortalAgentSpy, {}, false);
  });

  it('Test can send log item request', async function t() {
    // Arrange
    const reportPortalAgentSpy = sandbox.stub(ReportPortalAgent.prototype, 'sendLogItemRequest');
    const agentCheckConnectStub = sandbox.stub(ReportPortalAgent.prototype, 'checkConnection');
    agentCheckConnectStub.returns(true);
    reportPortalAgentSpy.returns({ test: 'test' });
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    // Act
    ReportHelper.reportAgentClass = ReportPortalAgent;
    await ReportHelper.createReportAgent({ host: 'stub' });
    ReportHelper.sendLogItemRequest(ReportHelper.defaultReportStoreKey, {}, false);
    // Assert
    assert.equal(reportPortalAgentSpy.calledOnce, true);
    sandbox.assert.calledWith(reportPortalAgentSpy, {}, false);
  });

  it('Test can send finish all item request', async function t() {
    // Arrange
    const reportPortalAgentSpy = sandbox.stub(
      ReportPortalAgent.prototype,
      'finishAllAgentRequests'
    );
    const agentCheckConnectStub = sandbox.stub(ReportPortalAgent.prototype, 'checkConnection');
    agentCheckConnectStub.returns(true);
    reportPortalAgentSpy.returns({ test: 'test' });
    const stubCheckAliveHost = sandbox.stub(axios, 'create');
    stubCheckAliveHost.returns({ get: () => Promise.resolve(true) });
    // Act
    ReportHelper.reportAgentClass = ReportPortalAgent;
    await ReportHelper.createReportAgent({ host: 'stub' });
    ReportHelper.finishAllAgentRequests(ReportHelper.defaultReportStoreKey, {});
    // Assert
    assert.equal(reportPortalAgentSpy.calledOnce, true);
    sandbox.assert.calledWith(reportPortalAgentSpy);
  });
});
