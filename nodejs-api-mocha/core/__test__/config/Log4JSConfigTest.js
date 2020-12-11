/* eslint-disable global-require,max-len,no-undef */
delete require.cache[require.resolve('../../helper/runner.helper')];
delete require.cache[require.resolve('../../helper/report.helper')];
const log4js = require('log4js');
const chai = require('chai');
const path = require('path');
const { Log4jsConfig } = require('../../config/log4js');
const { Logger, LoggerManager } = require('../../log');
const { RunnerHelper } = require('../../helper/runner.helper');
const { Log4jsReportPortal } = require('../../report/log4js');
const sinon = require('sinon');

const { assert } = chai;

describe('Unit Test for log4js index.js & Log4jsReportPortalAppender.js', function s() {
  const stubLoggerKey = 'stub';
  let sandbox = sinon.createSandbox();
  let infoSpy = sandbox.spy();
  let loggerManagerSpy = sandbox.spy();
  let log4jsConfigureSpy = {};
  // // Make sure log4js.getLogger() returns an object containing our spy.
  let getLoggerStub = {};
  let loggerManagerInfoStub = {};
  let loggerManagerErrorStub = {};
  let loggerManagerWarnStub = {};
  let loggerManagerDebugStub = {};
  after(function cleanSuite() {
    delete require.cache[require.resolve('../../helper/runner.helper')];
    delete require.cache[require.resolve('../../helper/report.helper')];
    sandbox.restore();
  });
  beforeEach(function setUpTest() {
    sandbox = sinon.createSandbox();
    infoSpy = sandbox.spy();
    loggerManagerSpy = sandbox.spy();
    loggerManagerInfoStub = sandbox.stub(LoggerManager, 'info');
    loggerManagerErrorStub = sandbox.stub(LoggerManager, 'error');
    loggerManagerWarnStub = sandbox.stub(LoggerManager, 'warn');
    loggerManagerDebugStub = sandbox.stub(LoggerManager, 'debug');
    loggerManagerInfoStub.callsFake(loggerManagerSpy);
    loggerManagerErrorStub.callsFake(loggerManagerSpy);
    loggerManagerWarnStub.callsFake(loggerManagerSpy);
    loggerManagerDebugStub.callsFake(loggerManagerSpy);
    log4jsConfigureSpy = sandbox.spy(log4js, 'configure');
    // // Make sure log4js.getLogger() returns an object containing our spy.
    getLoggerStub = sandbox.stub(log4js, 'getLogger');
    getLoggerStub.returns({
      info: infoSpy,
      error: infoSpy,
      warn: infoSpy,
      debug: infoSpy
    });
  });

  afterEach(function resetSandbox() {
    // Restore all the things made through the sandbox
    sandbox.restore();
    infoSpy.resetHistory();
    loggerManagerSpy.resetHistory();
    log4jsConfigureSpy.resetHistory();
  });

  it('Can load Log Folder Without TestRunner', function t() {
    Log4jsConfig('');
    const getConfigureObjectParam = log4jsConfigureSpy.getCalls()[0].args;
    const configureObject = getConfigureObjectParam[0];
    const fileAppenders = configureObject.appenders.multi;
    const actualLogFolder = fileAppenders.base;
    assert.equal(actualLogFolder, 'logs/logs', 'Error in generate log folder');
  });

  it('Can load Log Folder With TestRunner', function t() {
    RunnerHelper.appRootPath = 'StubRootPath';
    Log4jsConfig('');
    const getConfigureObjectParam = log4jsConfigureSpy.getCalls()[0].args;
    const configureObject = getConfigureObjectParam[0];
    const fileAppenders = configureObject.appenders.multi;
    const actualLogFolder = fileAppenders.base;
    assert.equal(
      actualLogFolder,
      'StubRootPath/logs',
      'Error in generate log folder'
    );
  });

  it('Can load ReportPortal Appender', function t() {
    const appender = new Log4jsReportPortal({ sendLogItemRequest: () => {} });
    exports.configure = appender.configure;
    const log4jsAppenderPath = path.join(__dirname, 'Log4JSConfigTest.js');
    Log4jsConfig('logs', log4jsAppenderPath);
    const log = new Logger('StubLog');
    log.info('stub message');
    appender.reportPortalAppender(() => {})({
      level: { logLevel: 'info', levelStr: 'stub' }
    });
    assert.equal(infoSpy.calledOnce, true, 'Send Log Data Unsuccessfully');
    assert.equal(
      infoSpy.calledWithExactly('stub message'),
      true,
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log info correct', function t() {
    Log4jsConfig('logs');
    const log = new Logger('StubLog');
    log.info('stub message');
    assert.equal(infoSpy.calledOnce, true, 'Send Log Data Unsuccessfully');
    assert.equal(
      infoSpy.calledWithExactly('stub message'),
      true,
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log error correct', function t() {
    Log4jsConfig('logs');
    const log = new Logger('StubLog');
    log.error('stub message');
    assert.equal(infoSpy.calledOnce, true, 'Send Log Data Unsuccessfully');
    assert.equal(
      infoSpy.calledWithExactly('stub message'),
      true,
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log warn correct', function t() {
    Log4jsConfig('logs');
    const log = new Logger('StubLog');
    log.warn('stub message');
    assert.equal(infoSpy.calledOnce, true, 'Send Log Data Unsuccessfully');
    assert.equal(
      infoSpy.calledWithExactly('stub message'),
      true,
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log debug correct', function t() {
    Log4jsConfig('logs');
    const log = new Logger('StubLog');
    log.debug('stub message');
    assert.equal(infoSpy.calledOnce, true, 'Send Log Data Unsuccessfully');
    assert.equal(
      infoSpy.calledWithExactly('stub message'),
      true,
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can instance LoggerManager', function t() {
    const instanceLoggerManger = () => {
      return new LoggerManager();
    };
    assert.throw(
      instanceLoggerManger,
      Error,
      'Cannot construct singleton',
      'Has error in protect LoggerManager instace'
    );
  });

  it('Test can create logger by getLogger in LoggerManager', function t() {
    const log = LoggerManager.getLogger('Stub');
    assert.instanceOf(log, Logger, 'Error in create logger ');
  });

  it('Test can get correctly logger by getLogger in LoggerManager', function t() {
    LoggerManager.createLogger('Stub');
    const log = LoggerManager.getLogger('Stub');
    assert.instanceOf(log, Logger, 'Error in create logger ');
  });

  it('Test can send log info with LoggerManager', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'info');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.info(null, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 1, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log warn with LoggerManager', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'warn');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.warn(null, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 1, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log error with LoggerManager', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'error');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.error(null, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 1, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log debug with LoggerManager', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'debug');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.debug(null, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 1, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log info with LoggerManager and log key', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'info');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.createLogger(stubLoggerKey);
    LoggerManager.info(stubLoggerKey, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 2, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log warn with LoggerManager log key', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'warn');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.createLogger(stubLoggerKey);
    LoggerManager.warn(stubLoggerKey, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 2, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log error with LoggerManager log key', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'error');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.createLogger(stubLoggerKey);
    LoggerManager.error(stubLoggerKey, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 2, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });

  it('Test can send log debug with LoggerManager log key', function t() {
    sandbox.restore();
    const loggerStub = sandbox.stub(Logger.prototype, 'debug');
    loggerStub.callsFake(loggerManagerSpy);
    LoggerManager.createLogger(stubLoggerKey);
    LoggerManager.debug(stubLoggerKey, 'stub message');
    assert.equal(loggerManagerSpy.callCount, 2, 'Send Log Data Unsuccessfully');
    assert.equal(
      loggerManagerSpy.firstCall.args,
      'stub message',
      'Send Log Data Unsuccessfully'
    );
  });
});
