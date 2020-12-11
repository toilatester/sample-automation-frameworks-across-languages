/* eslint-disable global-require,max-len, no-empty,no-console */
const path = require('path');
const { setUpConfigAndRunTest } = require('./core/runner');
const { RunnerHelper } = require('./core/helper');
const ReportConfig = require('./config/report/report.config.json');
/**
 * Example usage with full params options
 * node index.js \
 * -f debug.config.json \
 * --rp reportportal.debug.json \
 * --retries 4 \
 * -s ScenarioFolder \
 * -t 'Login Test' abctest anotherscriptag \
 * --rpln SampleInputLaunchName --rpld "Sample launch Desc" \
 * --rpsn SampleSuiteInputName --rpsd 'Sample Suite Desc' \
 * --rpltags launchtag1 launchtag2 launchtag3 \
 * --rpstags suitetag1 suitetag2 suitetag3 \
 */
const argv = require('yargs')
  .usage('Usage: node $0 [options]')
  .option('u', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'username to authenticate rest',
    demandOption: true,
    alias: 'username'
  })
  .option('p', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'password to authenticate rest',
    demandOption: true,
    alias: 'password'
  })
  .option('env', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'environment to run test scripts',
    demandOption: true,
    default: null,
    type: 'string'
  })
  .option('namespace', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'namespace store to run test.',
    default: null
  })
  .option('f', {
    // document options.
    array: false,
    description: 'Service config file name. Config locate in config/runner folder',
    demandOption: true,
    type: 'string',
    alias: 'restServiceConfig'
  })
  .option('fd', {
    // document options.
    array: false,
    description: 'edi config file name. Config locate in config/runner folder',
    default: 'edi.config.json',
    type: 'string',
    alias: 'sftpServiceConfig'
  })
  .option('rp', {
    // document options.
    array: false, // even single values will be wrapped in [].
    type: 'string',
    description: 'ReportPortal config file. Config locate in config/report folder',
    default: 'reportportal.debug.json',
    alias: 'reportPortalConfig'
  })
  .option('s', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'path to test scripts',
    demandOption: true,
    alias: 'scenarios',
    default: 'scenarios',
    type: 'string'
  })
  .option('t', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'list of tags to run test',
    default: [],
    alias: 'tags'
  })
  .option('alternativeAccounts', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'username to authenticate ',
    default: [],
    alias: 'listAccounts'
  })
  .option('sftpUser', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'username to authenticate sftp',
    default: null
  })
  .option('sftpPass', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'password to authenticate sftp',
    default: null
  })
  .option('rpln', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Launch Name in ReportPortal',
    alias: 'launchName'
  })
  .option('rpld', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Launch Description in ReportPortal',
    default: 'sampleapp',
    alias: 'launchDescription'
  })
  .option('rpltags', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'Launch Tags in ReportPortal',
    default: [],
    alias: 'launchTags'
  })
  .option('rpsn', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Suite Name in ReportPortal',
    alias: 'suiteName'
  })
  .option('rpsd', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Suite Description in ReportPortal',
    default: 'sampleapp Suite',
    alias: 'suiteDescription'
  })
  .option('rpstags', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'Suite Tags in ReportPortal',
    default: [],
    alias: 'suiteTags'
  })
  .option('to', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'default timeout for tests',
    default: null,
    type: 'number',
    alias: 'timeout'
  })
  .option('retries', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Retries failed tests n times.',
    type: 'number',
    default: 3
  })
  .option('performanceLog', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'environment to capture performanceLog with heapdump memory',
    default: false,
    type: 'boolean'
  })
  .option('parallel', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'environment to run test scripts',
    default: true,
    type: 'boolean'
  })
  .option('d', {
    // document options.
    array: false,
    description: 'Turn on debug mode and all data will not send to ReportPortal',
    type: 'boolean',
    default: false,
    alias: 'debug'
  })
  .option('h', {
    alias: 'help',
    description: 'display help message'
  })
  .epilog('sampleapp copyright 2019').argv;

const appRootPath = path.resolve(__dirname);
RunnerHelper.deleteFolderRecursive(path.resolve(appRootPath, 'reports'));
RunnerHelper.deleteFolderRecursive(path.resolve(appRootPath, 'logs'));
RunnerHelper.deleteFolderRecursive(path.resolve(appRootPath, 'performance.logs'));
setUpConfigAndRunTest(argv, appRootPath, ReportConfig);
