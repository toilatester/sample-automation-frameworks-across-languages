/* eslint-disable global-require,max-len, no-empty,no-console */
const path = require('path');
const fs = require('fs');
const { Execute } = require('../../core/runner/execute');
const { MochaReportListener, ReportPortalAgent } = require('../../core/report');
const { RunnerHelper, ReportHelper, ConfigHelper, PerformanceHelper } = require('../../core/helper');
const { LoggerListener, Logger } = require('../../core/log');
const { Log4jsConfig } = require('../../core/config/log4js');
const { BuildInfo } = require('../../services/common/build.info.service');

Log4jsConfig('logs/pre-setup-log');
function notifyMessage() {
  printToConsoleWithRedColor(
    '\nCompleted executing test, please view detail report in 192.168.50.96:8080 or in folder reports!. Execution process will exit after 5s'
  );
  resetConsoleLogColor();
}

async function finishAllReportAgentRequests(reportAgents, parallel, resolve) {
  {
    if (RunnerHelper.debugMode) return resolve('Completed Run In Debug Mode');
    const completeAllPoolLaunch = [];
    reportAgents.forEach(async (agent) => {
      if (parallel) {
        completeAllPoolLaunch.push(agent.finishAllAgentRequests());
      } else {
        completeAllPoolLaunch.push(finishLaunchInSingleThread(agent));
      }
    });
    return Promise.all(completeAllPoolLaunch).then((result) => {
      console.log('Completed send all log to agent', result);
      resolve();
    });
  }
}

async function finishLaunchInSingleThread(agent) {
  await agent.finishAllAgentRequests();
  await agent.sendLaunchRequest({}, false, true);
  notifyMessage();
}

/**
 *
 * username
 * password
 * sftpUser
 * sftpPass
 * alternativeAccounts
 * namespace
 * env
 * @param {Object} argv
 * @example
 * {
 *  username: "sampleUser",
 *  password: "samplePass",
 *  sftpUser: "sampleSftpUser",
 *  sftpPass: "sampleSftpPass",
 *  namespace: "auto_qa",
 *  env: "qa",
 *  alternativeAccounts: {admin:adminImpersonateUser/pass, manager:managerImpersonateUser/pass}
 * }
 */
function setUpAuthenticateVariable(argv) {
  const { username, password, sftpUser, sftpPass, alternativeAccounts, namespace, env } = argv;
  ConfigHelper.restAuthenticateUserName = username;
  ConfigHelper.restAuthenticatePassword = password;
  ConfigHelper.sftpAuthenticateUserName = sftpUser;
  ConfigHelper.sftpAuthenticatePassword = sftpPass;
  ConfigHelper.listAuthenticateAccount = alternativeAccounts;
  ConfigHelper.namespace = namespace;
  ConfigHelper.environment = env;
}

/**
 * restServiceConfig - rest service config file name Ex: local.config.json
 * sftpServiceConfig - sftp service config file name Ex: local.config.json
 * scenarios - folder path contains all test scripts
 * debug - enalbe debug mode
 * appRootPath - root path, this will use to automatically search the config
 * file.
 * Ex:
 * restServiceConfig=sample.local.json
 * appRootPath=D:/API
 * This will automatically search the sample.local.json inside
 * D:/API/config/runner/rest.service/sample.local.json
 * @param {Object} argv
 * @example
 * {
 *    restServiceConfig: "qa.config.json",
 *    sftpServiceConfig: "edi.config.json",
 *    scenarios: "scenarios",
 *    debug: false,
 *    appRootPath: "D:/API-AUTO"
 * }
 */
function setUpServiceConfigFiles(argv) {
  const { restServiceConfig, sftpServiceConfig, scenarios, debug, appRootPath } = argv;
  RunnerHelper.appRootPath = appRootPath;
  RunnerHelper.debugMode = debug;
  RunnerHelper.testFolderPath = path.join(RunnerHelper.appRootPath, scenarios);
  RunnerHelper.restServiceConfigFilePath = path.join(
    RunnerHelper.appRootPath,
    'config',
    'runner',
    'rest.service',
    restServiceConfig
  );
  RunnerHelper.sftpServiceConfigFilePath = path.join(
    RunnerHelper.appRootPath,
    'config',
    'runner',
    'sftp.service',
    sftpServiceConfig
  );
}

/**
 * below function will split list test files
 * to multiple thread pool by their naming convention
 * Ex: CON_Sample_1, CON_Sample_2, ADJ_Sample_1, ADJ_Sample_2
 * will create 2 thread pool. The first thread pool will store all test script
 * has CON prefix and the second thread pool will store all test script
 * has ADJ prefix
 * :D this function can be used in feature if our team want
 * to run test in parallel based on their module and avoid having an issue
 * with shared test data in the same module
 * We just replace the method in function createExecutionPool
 * const testFiles = listTestFiles.splice(0, totalFileToSplit);
 * by the new one below
 * const testFiles = listTestFiles.splice(0, splitTestFilesByModuleName(listTestFiles));
 */
function splitTestFilesByModuleName(listTestFiles) {
  const baseFile = listTestFiles[0];
  const baseModuleName = baseFile.split('_')[0];
  const listTestFilesInModule = [];
  for (const testFile of listTestFiles) {
    const moduleName = testFile.split('_')[0];
    if (moduleName === baseModuleName) listTestFilesInModule.push(testFile);
    else break;
  }
  return listTestFilesInModule.length;
}

let buildInfoDataCache = null;
async function getBuildInfo() {
  if (!buildInfoDataCache) {
    const buildInfo = new BuildInfo();
    buildInfoDataCache = await buildInfo.getBuildInfo();
  }
  return Promise.resolve(buildInfoDataCache);
}
function printToConsoleWithRedColor(message) {
  console.log('\x1b[31m', message);
}

function resetConsoleLogColor() {
  console.log('\x1b[0m', '\n');
}

function setUpConfigAndRunTest(argv, appRootPath, reportConfig, completedCallback = () => {}) {
  argv.appRootPath = appRootPath;
  setUpAuthenticateVariable(argv);
  setUpServiceConfigFiles(argv);
  run(argv, appRootPath, reportConfig, completedCallback);
}

function run(argv, appRootPath, reportConfig, completedCallback = () => {}) {
  const log = new Logger('ExecutionLog');
  const {
    tags,
    timeout,
    reportPortalConfig,
    launchName,
    launchDescription,
    launchTags,
    suiteName,
    suiteDescription,
    suiteTags,
    retries,
    parallel,
    performanceLog
  } = argv;
  // eslint-disable-next-line import/no-dynamic-require
  const ReportPortalConfig = require(path.join(RunnerHelper.appRootPath, 'config', 'report', reportPortalConfig));
  const logListener = new Logger('Listener');
  let countRetries = 0;
  let retriesScripts = [];

  /**
   * Init ReportPortal Agent and setup Log4JS
   */
  Log4jsConfig(null);
  ReportHelper.reportAgentClass = ReportPortalAgent;
  if (RunnerHelper.debugMode) {
    console.log('Run In Debug Mode');
    startRunTest(Promise.resolve.bind(Promise), Promise.reject.bind(Promise))
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    ReportHelper.createReportAgent(ReportPortalConfig, ReportHelper.defaultReportStoreKey)
      .then(async (agent) => {
        return new Promise(async (resolve, reject) => {
          performanceLog && PerformanceHelper.captureHeapMemory(RunnerHelper.appRootPath, 'StartExecuteTest');
          startRunTest(agent, resolve, reject);
        });
      })
      .then(async () => {
        // Start to run retries failed test
        await performRunRetry();
        await completedCallback();
        ReportHelper.mergeJenkinsResult(RunnerHelper.appRootPath, parallel);
        notifyMessage();
        setTimeout(() => process.exit(0), 5000);
      })
      .catch(async (err) => {
        /**
         * allow executing test event when ReportPortal server shutting down
         */
        log.error('Has error when executing test', err);
        logListener.error('Has error when executing test', err);
        Log4jsConfig(null);
        await handleExecuteException(err);
      });
  }

  async function startRunTest(agent, resolve, reject) {
    try {
      return invokeTests(resolve);
    } catch (err) {
      return reject(err);
    }
  }
  /**
   *
   * @param {Promise} resolve
   * @param {Boolean} isRetries
   * Execute test
   */
  async function invokeTests(resolve, isRetries = false) {
    try {
      const responseRawInfo = await getBuildInfo();
      log.info('================== START RUN SUITE ======================');
      log.info('=========================================================');
      log.info('Run Test With Options', argv);
      log.info('Build Info:', responseRawInfo);
      retriesScripts = [...ReportHelper.failedTestScripts];
      ReportHelper.clearFailedTestScripts();
      if (isRetries) {
        return executeTestWithRetries(resolve, responseRawInfo);
      }
      const fileOrFolderStats = fs.statSync(RunnerHelper.testFolderPath);
      const isSigleTestFile = fileOrFolderStats.isFile();
      return executeTest(resolve, isSigleTestFile, responseRawInfo);
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  async function invokeRunRetries() {
    return new Promise(async (resolve, reject) => {
      try {
        countRetries++;
        return invokeTests(resolve, true);
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
   *
   * @param {Promise} resolve
   * @param {Boolean} isSigleTestFile
   * @param {Object} responseRawInfo
   * Create excution context
   */
  async function executeTest(resolve, isSigleTestFile, responseRawInfo) {
    log.info('Execution First Time');
    const reportAgent = RunnerHelper.debugMode ? {} : ReportHelper.getAgent(ReportHelper.defaultReportStoreKey);
    const launchResult = await startLaunch(reportAgent, responseRawInfo.body, false);
    const listTestFiles = isSigleTestFile
      ? [RunnerHelper.testFolderPath]
      : RunnerHelper.filterFileByExtensionAndTag(RunnerHelper.testFolderPath, tags, '.js', []);
    const executionPool = createExecutionPool(listTestFiles, launchResult.id, responseRawInfo, false);
    performanceLog && PerformanceHelper.captureHeapMemory(RunnerHelper.appRootPath, `executeTest${Date.now()}`);
    await executeRun(executionPool, resolve);
  }

  /**
   *
   * @param {Promise} resolve
   * @param {Array} retriesScripts
   * @param {Object} responseRawInfo
   * Create excution context for re-running failed scripts
   */
  async function executeTestWithRetries(resolve, responseRawInfo) {
    log.info('Execution Failed Tests');
    const reportAgent = RunnerHelper.debugMode ? {} : ReportHelper.getAgent(ReportHelper.defaultReportStoreKey);
    const launchResult = await startLaunch(reportAgent, responseRawInfo.body, true);
    const executionPool = createExecutionPool(retriesScripts, launchResult.id, responseRawInfo, true);
    performanceLog &&
      PerformanceHelper.captureHeapMemory(RunnerHelper.appRootPath, `executeTestWithRetries${Date.now()}`);
    return executeRun(executionPool, resolve);
  }

  function executeRun(executionPool, resolve) {
    log.info('Start to execute tests');
    return Promise.all(executionPool).then(async (reportAgents) =>
      finishAllReportAgentRequests(reportAgents, parallel, resolve)
    );
  }

  async function startLaunch(agent, buildInfoData, isRetries) {
    if (RunnerHelper.debugMode) return Promise.resolve(-1);
    const { reportDescription, reportTags } = ReportHelper.reportPortalInfo(buildInfoData);
    const retriesName = `Retries Failed Test ${launchName || ReportPortalConfig.launch} ${countRetries} times`;
    const defaultName = launchName || ReportPortalConfig.launch;
    const name = isRetries ? retriesName : defaultName;
    return agent.sendLaunchRequest(
      {
        name,
        description: `${launchDescription}\n${reportDescription}`,
        tags: launchTags.concat(reportTags)
      },
      true
    );
  }

  // We create execution pool base on test script module
  // Group all related test script of same module to thread pool
  function createExecutionPool(listTestFiles, launchId, responseRawInfo, isRetries = false) {
    log.info('Create Execution Pool');
    if (!parallel) {
      return [createMultipleExcute(listTestFiles, launchId, responseRawInfo, 1, isRetries)];
    }
    const executionPools = [];
    let currentPoolNumber = 1;
    while (listTestFiles.length > 0) {
      // const testFiles = listTestFiles.splice(0, totalFileToSplit);
      const testFiles = listTestFiles.splice(0, splitTestFilesByModuleName(listTestFiles));
      executionPools.push(createMultipleExcute(testFiles, launchId, responseRawInfo, currentPoolNumber, isRetries));
      currentPoolNumber++;
    }
    return executionPools;
  }

  function createMultipleExcute(listTestFiles, launchId, responseRawInfo, currentPoolNumber, isRetries = false) {
    log.info('Create Execution Tasks');
    const buildInfoData = responseRawInfo.body;
    const reportStoreKey = listTestFiles.map((file) => path.basename(file)).join('_');
    const reportPath = isRetries ? `reports/retries${countRetries}` : 'reports';
    return new Promise(async (resolve) => {
      createExecutionTask(resolve, listTestFiles, {
        launchId,
        reportPath,
        reportStoreKey,
        currentPoolNumber,
        buildInfoData,
        isRetries
      });
    });
  }

  function createExecutionTask(resolve, listTestFiles, executionTaskOption) {
    log.info('Create Execution Task');
    if (RunnerHelper.debugMode) return createExecutionTaskDebugMode(resolve, listTestFiles, executionTaskOption);
    return createExecutionTaskWithReportAgent(resolve, listTestFiles, executionTaskOption);
  }

  function createExecutionTaskDebugMode(resolve, listTestFiles, executionTaskOption) {
    log.info('Create Execution Task Debug Mode');
    const { reportPath, currentPoolNumber, isRetries } = executionTaskOption;
    new Execute({ isRetries })
      .addCompleteCallBack(() => {
        resolve(1);
      })
      .setTimeout(timeout)
      .addReporter(
        'mocha-multi-reporters',
        Object.assign(reportConfig, {
          mochaJenkinsReporterReporterOptions: {
            junit_report_path: `${reportPath}/JUnitResult_${currentPoolNumber}.xml`
          }
        })
      )
      .addTestFiles(listTestFiles)
      .run()
      .addTestListener(new LoggerListener());
  }

  function createExecutionTaskWithReportAgent(resolve, listTestFiles, executionTaskOption) {
    log.info('Create Execution Task With Report Agent');
    const { launchId, reportPath, reportStoreKey, currentPoolNumber, buildInfoData, isRetries } = executionTaskOption;
    return ReportHelper.createReportAgent(ReportPortalConfig, reportStoreKey).then((reportAgent) => {
      // To avoid having mutliple launch
      // and we need to merge it after run test
      // We will create a default launch and any reportportal agent
      // in executionTask will use it as parent launch
      reportAgent.sendLaunchRequest(
        {
          id: launchId
        },
        true
      );
      new Execute({ isRetries })
        .addCompleteCallBack(() => {
          resolve(reportAgent);
        })
        .setTimeout(timeout)
        .addReporter(
          'mocha-multi-reporters',
          Object.assign(reportConfig, {
            mochaJenkinsReporterReporterOptions: {
              junit_report_path: `${reportPath}/JUnitResult_${currentPoolNumber}.xml`
            }
          })
        )
        .addTestFiles(listTestFiles)
        .run()
        .addTestListener(new LoggerListener())
        .addTestListener(crateMochaReportPortalListener(reportAgent, buildInfoData, true));
      return reportAgent;
    });
  }
  async function performRunRetry() {
    const agent = ReportHelper.getReportPortalAgent(ReportHelper.defaultReportStoreKey);
    const hasFailedScripts = ReportHelper.failedTestScripts.length > 0;
    await agent.finishAllAgentRequests();
    await agent.sendLaunchRequest({}, false, true);
    for (let retriesRun = 1; retriesRun <= retries && hasFailedScripts; retriesRun++) {
      log.debug(`\nRetries failed test ${retriesRun} times`);
      printToConsoleWithRedColor(`Retries failed test ${retriesRun} times`);
      resetConsoleLogColor();
      performanceLog &&
        PerformanceHelper.captureHeapMemory(RunnerHelper.appRootPath, `StartExecuteRetries${retriesRun}`);
      await ReportHelper.clearAllReportPortalAgentStore();
      await invokeRunRetries();
      await ReportHelper.sendLaunchRequest(ReportHelper.defaultReportStoreKey, {}, false, true);
    }
    resetConsoleLogColor();
  }

  async function handleExecuteException(err) {
    try {
      await invokeTests(Promise.resolve.bind(Promise));
      await completedCallback();
      ReportHelper.mergeJenkinsResult(RunnerHelper.appRootPath, parallel);
    } catch (retriesErr) {
      console.log(retriesErr);
      log.error('Has error when executing test after retrying', err);
      logListener.error('Has error when executing test after retrying', err);
      printToConsoleWithRedColor(
        '\nHas error in execute test, please view ExecutionLog.log in folder logs for more details!. Execution process will exit after 10s'
      );
      resetConsoleLogColor();
      setTimeout(() => process.exit(1), 10000);
    }
  }
  /**
   *
   * @param {Object} buildInfoData
   * @param {boolean} isRetries
   * Create Mocha ReportPortal Listener
   */
  function crateMochaReportPortalListener(agent, buildInfoData, isParallel = true) {
    if (RunnerHelper.debugMode) {
      log.info('Run Mocha Test In Debug Mode');
      return {};
    }
    log.info('Init Mocha ReportPortal.io listener');
    const { reportDescription, reportTags } = ReportHelper.reportPortalInfo(buildInfoData);
    return new MochaReportListener(
      agent,
      suiteName || 'sampleapp Suite',
      `${reportDescription}\n\n\n\`\`\`${suiteDescription}\`\`\``,
      suiteTags.concat(reportTags),
      isParallel
    );
  }
}

exports.run = run;
exports.setUpAuthenticateVariable = setUpAuthenticateVariable;
exports.setUpServiceConfigFiles = setUpServiceConfigFiles;
exports.setUpConfigAndRunTest = setUpConfigAndRunTest;
