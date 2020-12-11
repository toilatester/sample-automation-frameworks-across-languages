/* eslint-disable global-require,max-len, no-empty,no-console */
const path = require('path');
const { cli } = require('../core/runner');
const { RunnerHelper } = require('../core/helper');
const ReportConfig = require('../config/report/report.config.json');
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
  .example(
    'node $0 --config=production.json --tags=login',
    'Run Test With Production Environment & Filter All Tests Have Tag "login" or "signup"'
  )
  .option('f', {
    // document options.
    array: false,
    description: 'Service config file name. Config locate in config/runner folder',
    demandOption: true,
    type: 'string',
    alias: 'serviceConfig',
  })
  .option('d', {
    // document options.
    array: false,
    description: 'Turn on debug mode and all data will not send to ReportPortal',
    type: 'boolean',
    default: false,
    alias: 'debug',
  })
  .option('t', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'list of tags to run test',
    default: [],
    alias: 'tags',
  })
  .option('s', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'path to test scripts',
    demandOption: true,
    alias: 'scenarios',
    type: 'string',
  })
  .option('u', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'username to authenticate rest',
    demandOption: true,
    alias: 'username',
  })
  .option('p', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'password to authenticate rest',
    demandOption: true,
    alias: 'password',
  })
  .option('alternativeAccounts', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'username to authenticate ',
    default: [],
    alias: 'listAccounts',
  })
  .option('rp', {
    // document options.
    array: false, // even single values will be wrapped in [].
    type: 'string',
    description: 'ReportPortal config file. Config locate in config/report folder',
    default: 'reportportal.config.json',
    alias: 'reportPortalConfig',
  })
  .option('rpln', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Launch Name in ReportPortal',
    alias: 'launchName',
  })
  .option('rpld', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Launch Description in ReportPortal',
    default: 'sample name',
    alias: 'launchDescription',
  })
  .option('rpltags', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'Launch Tags in ReportPortal',
    default: [],
    alias: 'launchTags',
  })
  .option('rpsn', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Suite Name in ReportPortal',
    alias: 'suiteName',
  })
  .option('rpsd', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Suite Description in ReportPortal',
    default: 'Sample Suite',
    alias: 'suiteDescription',
  })
  .option('rpstags', {
    // document options.
    array: true, // even single values will be wrapped in [].
    description: 'Suite Tags in ReportPortal',
    default: [],
    alias: 'suiteTags',
  })
  .option('to', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'default timeout for tests',
    default: null,
    type: 'number',
    alias: 'timeout',
  })
  .option('sftpUser', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'username to authenticate sftp',
    default: null,
  })
  .option('sftpPass', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'password to authenticate sftp',
    default: null,
  })
  .option('fd', {
    // document options.
    array: false,
    description: 'edi config file name. Config locate in config/runner folder',
    default: 'edi.config.json',
    type: 'string',
    alias: 'ediConfig',
  })
  .option('retries', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'Retries failed tests n times.',
    type: 'number',
    default: 2,
  })
  .option('namespace', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'namespace store to run test.',
    default: null,
  })
  .option('env', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'environment to run test scripts',
    demandOption: true,
    default: 'qa',
    type: 'string',
  })
  .option('parallel', {
    // document options.
    array: false, // even single values will be wrapped in [].
    description: 'environment to run test scripts',
    default: true,
    type: 'boolean',
  })
  .option('h', {
    alias: 'help',
    description: 'display help message',
  })
  .epilog('MinhHoang copyright 2019').argv;

const rootPath = path.resolve(path.resolve(__dirname), '..');
RunnerHelper.deleteFolderRecursive(path.resolve(rootPath, 'reports'));
RunnerHelper.deleteFolderRecursive(path.resolve(rootPath, 'logs'));

cli(argv, rootPath, ReportConfig);
