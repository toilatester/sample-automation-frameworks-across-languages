/* eslint-disable no-undef,prefer-destructuring,no-multi-assign,import/no-dynamic-require,no-console*/
const yargs = require('yargs');
const path = require('path');
const ApiServiceExecuteConfig = require('shared-lib-sample/core/helper').ConfigHelper;
const ApiServiceRunnerConfig = require('shared-lib-sample/core/helper').RunnerHelper;
const { BuildInfo } = require('shared-lib-sample/services/common/build.info.service');
const { ENGINE_CONFIG } = require('./config/engine');
const { STEP_CONFIG } = require('./pom');
const { PLUGIN_CONFIG, REPORT_CONFIG, LOG4JS_CONFIG } = require('./config');
const {
  EXTENSION_CONFIG,
  Execute,
  RunnerConfig,
  ExecuteConfigBuilder,
  ReportPortalAgent,
  LoggerManager,
  ReportPortalHelper,
} = require('./core');

// Sample command
// node index.js --env qa --namespace env_qa_auto --impersonateUserName env_qa_auto
// --guiRunConfig qa.auto.config.json --restRunConfig qa.auto.config.json
// --sftpRunConfig qa.auto.config.json --reportPortalConfig reportportal.debug.json
// --scenariosTestPattern '**/*.js' --retries 2
// --launchName "All_GUI" --rpld "Run from Jenkins"
// --suiteName "sampleapp Suite" --rpsd "Run from Jenkins"
// --rpltags "envinronment-auto"  --rpstags "envinronment-auto"
// --width 1920 --height 1080 --maximize true --headless true
// --outputConsole true --debug false
// --username "your_user_name" --password "your_password" --debug false
// --grep "@order"
const argv = yargs
  .usage('usage: $0 <command>')
  .option('stepsDefinition', {
    // document options.
    array: false,
    demandOption: false,
    default: false,
    description: 'Generat steps.d.ts for type hint',
    type: 'boolean',
  })
  .option('grep', {
    // document options.
    array: false,
    default: undefined,
    description:
      'pattern to filter test scripts, grep @smoke will run all test with tag name @smoke',
    type: 'string',
  })
  .option('scenariosTestPattern', {
    // document options.
    array: false,
    demandOption: true,
    description:
      "pattern to run test scripts, pattern must be defined inside dobule/single-quote Ex: '*.js','*test.js'",
    type: 'string',
  })
  .option('guiRunConfig', {
    // document options.
    array: false,
    demandOption: true,
    description: 'Execute GUI test config file name. Config locate in the config/runner/gui folder',
    type: 'string',
  })
  .option('restRunConfig', {
    // document options.
    array: false,
    demandOption: true,
    description:
      'Execute rest service config file name. Config locate in the config/runner/rest.service folder',
    type: 'string',
  })
  .option('sftpRunConfig', {
    // document options.
    array: false,
    demandOption: true,
    description:
      'Execute sftp service config file name. Config locate in the config/runner/sftp.service folder',
    type: 'string',
  })
  .option('reportPortalConfig', {
    // document options.
    array: false,
    demandOption: true,
    description: 'Execute config file name. Config locate in config/report folder',
    type: 'string',
  })
  .option('username', {
    // document options.
    array: false,
    description: 'username to authenticate',
    demandOption: true,
    type: 'string',
    alias: 'u',
  })
  .option('password', {
    // document options.
    array: false,
    description: 'password to authenticate',
    demandOption: true,
    type: 'string',
    alias: 'p',
  })
  .option('namespace', {
    // document options.
    array: false,
    description: 'namespace to run gui test',
    demandOption: true,
    type: 'string',
  })
  .option('env', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'environment to run test scripts',
    demandOption: true,
    default: 'qa',
    type: 'string',
  })
  .option('impersonateUserName', {
    // document options.
    array: false,
    description: 'impersonateUserName to authenticate',
    demandOption: true,
    type: 'string',
  })
  .option('retries', {
    // document options.
    array: false,
    description: 'Retries failed test',
    default: 2,
    type: 'number',
  })
  .option('width', {
    // document options.
    array: false,
    description: 'Browser width viewport',
    default: 1920,
    type: 'number',
  })
  .option('height', {
    // document options.
    array: false,
    description: 'Browser height viewport',
    default: 1080,
    type: 'number',
  })
  .option('maximize', {
    // document options.
    array: false,
    description: 'Set maximize browser',
    default: true,
    type: 'boolean',
  })
  .option('output', {
    // document options.
    array: false,
    description: 'Set report output folder',
    default: 'reports',
    type: 'string',
  })
  .option('launchName', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Launch Name in ReportPortal',
  })
  .option('launchDescription', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Launch Description in ReportPortal',
    default: 'sampleapp',
  })
  .option('launchTags', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'Launch Tags in ReportPortal',
    default: [],
  })
  .option('suiteName', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Suite Name in ReportPortal',
  })
  .option('suiteDescription', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Suite Description in ReportPortal',
    default: 'sampleapp Suite',
  })
  .option('suiteTags', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'Suite Tags in ReportPortal',
    default: [],
  })
  .option('headless', {
    // document options.
    array: false,
    description: 'Turn on/off headless mode and all data will not send to ReportPortal',
    type: 'boolean',
    default: true,
  })
  .option('debug', {
    // document options.
    array: false,
    description: 'Turn on/off debug mode and all data will not send to ReportPortal',
    type: 'boolean',
    default: false,
  })
  .option('outputConsole', {
    // document options.
    array: false,
    description: 'Turn on/off log to console ',
    type: 'boolean',
    default: true,
  })
  .help('help').argv;
const {
  env,
  namespace,
  username,
  password,
  scenariosTestPattern,
  guiRunConfig,
  restRunConfig,
  sftpRunConfig,
  reportPortalConfig,
  output,
  impersonateUserName,
  width,
  height,
  maximize,
  grep,
  launchName,
  suiteName,
  launchDescription,
  suiteDescription,
  launchTags,
  suiteTags,
  headless,
  debug,
  outputConsole,
  stepsDefinition,
  retries,
} = argv;
// Init log4js configure
LOG4JS_CONFIG.LOG4JS.CONFIG('logs', outputConsole);
LoggerManager.createLogger('ExecutionLog');
const log = LoggerManager.getLogger('ExecutionLog');
log.info('Run Test With Options:\n', argv);
/**
 * Set up all global variables before running test
 */
RunnerConfig.appRootPath = path.resolve(__dirname);
RunnerConfig.testsFilePattern = path.resolve(
  RunnerConfig.appRootPath,
  'scenarios',
  scenariosTestPattern
);
RunnerConfig.configFilePath = path.resolve(
  path.resolve(__dirname),
  'config',
  'runner',
  'gui',
  guiRunConfig
);
ApiServiceRunnerConfig.restServiceConfigFilePath = path.resolve(
  path.resolve(__dirname),
  'config',
  'runner',
  'rest.service',
  restRunConfig
);
ApiServiceRunnerConfig.sftpServiceConfigFilePath = path.resolve(
  path.resolve(__dirname),
  'config',
  'runner',
  'sftp.service',
  sftpRunConfig
);
// Config the api service library
// and user can call it in GUI test script
ApiServiceExecuteConfig.restAuthenticateUserName = RunnerConfig.username = username;
ApiServiceExecuteConfig.restAuthenticatePassword = RunnerConfig.password = password;
RunnerConfig.impersonateUserName = impersonateUserName;
RunnerConfig.isDebugMode = debug;
RunnerConfig.namespace = namespace;
RunnerConfig.launchName = launchName;
RunnerConfig.suiteName = suiteName;
RunnerConfig.launchDescription = launchDescription;
RunnerConfig.suiteDescription = suiteDescription;
RunnerConfig.launchTags = launchTags;
RunnerConfig.suiteTags = suiteTags;
RunnerConfig.retriesNumber = retries;
RunnerConfig.environment = env;
const REPORT_PORTAL_CONFIG = require(path.join(
  RunnerConfig.appRootPath,
  'config',
  'report',
  reportPortalConfig
));
const OUTPUT_FOLDER = path.resolve(RunnerConfig.appRootPath, output);
const RUNNER_CONFIG = ExecuteConfigBuilder.createConfig()
  .setHeadless(headless)
  .setMaximizeWindow(maximize)
  .setWindowWidth(width)
  .setWindowHeight(height)
  .setTestsFilePattern(RunnerConfig.testsFilePattern)
  .setOutPutFolderPath(OUTPUT_FOLDER)
  .setAllStepsInclude(STEP_CONFIG)
  .setAllPluginsConfig(PLUGIN_CONFIG)
  .setAllEngineConfig(['REST', 'PUPPETEER'], ENGINE_CONFIG)
  // setAllHelpersExtendConfig must be config after engine config
  // to override some original methods in helper engine
  .setAllHelpersExtendConfig(EXTENSION_CONFIG)
  .setReportConfig(
    REPORT_CONFIG.MOCHA_MULTI.NAME,
    REPORT_CONFIG.MOCHA_MULTI.CONFIG,
    path.resolve(RunnerConfig.appRootPath, output)
  )
  .build();

const getBuildInfo = async () => {
  if (!RunnerConfig.isDebugMode) {
    const buildInfoService = new BuildInfo();
    const reportInfo = await buildInfoService.getReportPortalInformation();
    const cliTags = launchTags.concat(suiteTags);
    ReportPortalHelper.reportTags = reportInfo.tags.concat(cliTags);
    ReportPortalHelper.reportDescription = `${reportInfo.description}\n${launchDescription}\n${suiteDescription}`;
  }
};

const execute = new Execute(RUNNER_CONFIG, REPORT_PORTAL_CONFIG);
execute
  .createReportAgent(ReportPortalAgent)
  .catch((error) => {
    // Ingore Connection Error to ReportPortal Server
    // In debug mode
    if (RunnerConfig.isDebugMode) {
      log.warn('Execution In Debug Mode');
      return Promise.resolve();
    }
    throw error;
  })
  .then(getBuildInfo)
  .then(() => {
    if (stepsDefinition) execute.createStepsDefinition(RunnerConfig.appRootPath, debug);
    else execute.run(false, grep, debug);
  })
  .catch((error) => {
    log.error('Execution Error:\n', error);
    console.log(
      '\x1b[31m',
      '\nHas error in execute test, please view ExecutionLog.log in folder logs for more details!'
    );
    console.log('\x1b[31m', '\n Execution process will exit after 10s');
    console.log('\x1b[0m', '\n');
    setTimeout(() => process.exit(1), 10000);
  });
