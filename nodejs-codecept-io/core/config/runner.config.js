const fs = require('fs');
const path = require('path');

// singleton instance variables
const runnerConfigObject = {
  runnerConfigInstance: null,
  appRootPath: null,
  configFilePath: null,
  username: null,
  password: null,
  namespace: null,
  impersonateUserName: null,
  testsFilePattern: null,
  launchName: null,
  suiteName: null,
  launchDescription: null,
  suiteDescription: null,
  launchTags: null,
  suiteTags: null,
  isDebugMode: false,
  retries: null,
  env: null
};

// Get debug config in case user runs test directly from codecept command
const debugConfigPath = path.join(path.resolve(__dirname), '..', '..', 'config', 'runner', 'gui', 'debug.config.json');
const getConfigValue = (objectData, configKey, defaultValue) => {
  // Check if first time generate config value in config.json data
  // Or get value from ServiceConfig Object again
  const isServiceConfigObject = objectData.constructor.name === 'RunnerConfig';
  const configValue = isServiceConfigObject ? objectData.config[configKey] : objectData[configKey];
  const isReturnDefaultValue = !configValue && defaultValue;
  const isThrowException = !(configValue || defaultValue);
  if (isReturnDefaultValue) return defaultValue;
  if (isThrowException) throw new Error(`Config data ${JSON.stringify(objectData)} is invalid with key ${configKey}`);
  return configValue;
};

const parsingConfigDataFile = (configPath) => {
  configPath = configPath || debugConfigPath;
  try {
    return JSON.parse(fs.readFileSync(configPath));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `Error in parsing config data. Please create config data in folder config/runner. No such file or directory at "${configPath}", please check the config path again`
      );
    }
    if (error instanceof SyntaxError) {
      throw new Error(
        `Error in parsing config data, config data contains invalid JSON syntax. Syntax Error: ${
          error.message
        } at file ${configPath}`
      );
    }
    throw new Error(
      `Error in parsing config data. Please create config data in folder config/runner. ${error.name} ${error.message}`
    );
  }
};
const joinPath = (first, second) => {
  if (!first || !second) return second;
  const lastPart = second[0] !== '/' ? `/${second}` : second;
  return first + lastPart;
};

class RunnerConfig {
  constructor(config, isConfigFile = true) {
    if (!runnerConfigObject.runnerConfigInstance) {
      this.config = isConfigFile ? parsingConfigDataFile(config || runnerConfigObject.configFilePath) : config;
      runnerConfigObject.runnerConfigInstance = this;
    }
    return runnerConfigObject.runnerConfigInstance;
  }

  getConfigData(configKey, defaultValue) {
    return getConfigValue(this.config, configKey, defaultValue);
  }

  urlBuilder(url, pathPage) {
    return joinPath(url, pathPage);
  }

  get authenticateUrl() {
    return this.getConfigData('authenticateUrl');
  }

  get namespace() {
    return this.getConfigData('namespace');
  }

  get env() {
    return this.getConfigData('env');
  }

  get logoutUrl() {
    return this.getConfigData('logoutUrl');
  }

  get appUrl() {
    return joinPath(this.getConfigData('appUrl'), `${this.getConfigData('namespace')}/catalyst-inv-core-spa-ui`);
  }

  get pageLoadTimeOut() {
    return this.getConfigData('pageLoadTimeOut');
  }

  get actionTimeout() {
    return this.getConfigData('actionTimeout');
  }

  get viewport() {
    return this.getConfigData('viewport');
  }

  static set appRootPath(rootPath) {
    if (!runnerConfigObject.appRootPath && rootPath) {
      runnerConfigObject.appRootPath = rootPath;
    }
  }

  static get appRootPath() {
    return runnerConfigObject.appRootPath;
  }

  static set configFilePath(configPath) {
    if (!runnerConfigObject.configFilePath && configPath) {
      runnerConfigObject.configFilePath = configPath;
    }
  }

  static get configFilePath() {
    return runnerConfigObject.configFilePath;
  }

  static set username(user) {
    if (!runnerConfigObject.username && user) {
      runnerConfigObject.username = user;
    }
  }

  static get username() {
    return runnerConfigObject.username;
  }

  static set password(pass) {
    if (!runnerConfigObject.password && pass) {
      runnerConfigObject.password = pass;
    }
  }

  static get password() {
    return runnerConfigObject.password;
  }

  static set namespace(name) {
    if (!runnerConfigObject.namespace && name) {
      runnerConfigObject.namespace = name;
    }
  }

  static get namespace() {
    return runnerConfigObject.namespace;
  }

  static set impersonateUserName(impersonateUser) {
    if (!runnerConfigObject.impersonateUserName && impersonateUser) {
      runnerConfigObject.impersonateUserName = impersonateUser;
    }
  }

  static get impersonateUserName() {
    return runnerConfigObject.impersonateUserName;
  }

  static set testsFilePattern(pattern) {
    if (!runnerConfigObject.testsFilePattern && pattern) {
      runnerConfigObject.testsFilePattern = pattern;
    }
  }

  static get testsFilePattern() {
    return runnerConfigObject.testsFilePattern;
  }

  static set launchName(name) {
    if (!runnerConfigObject.launchName && name) {
      runnerConfigObject.launchName = name;
    }
  }

  static get launchName() {
    return runnerConfigObject.launchName;
  }

  static set suiteName(name) {
    if (!runnerConfigObject.suiteName && name) {
      runnerConfigObject.suiteName = name;
    }
  }

  static get suiteName() {
    return runnerConfigObject.suiteName;
  }

  static set launchDescription(description) {
    if (!runnerConfigObject.launchDescription && description) {
      runnerConfigObject.launchDescription = description;
    }
  }

  static get launchDescription() {
    return runnerConfigObject.launchDescription;
  }

  static set suiteDescription(description) {
    if (!runnerConfigObject.suiteDescription && description) {
      runnerConfigObject.suiteDescription = description;
    }
  }

  static get suiteDescription() {
    return runnerConfigObject.suiteDescription;
  }

  static set launchTags(tags) {
    if (!runnerConfigObject.launchTags && tags) {
      runnerConfigObject.launchTags = tags;
    }
  }

  static get launchTags() {
    return runnerConfigObject.launchTags;
  }

  static set suiteTags(tags) {
    if (!runnerConfigObject.suiteTags && tags) {
      runnerConfigObject.suiteTags = tags;
    }
  }

  static get suiteTags() {
    return runnerConfigObject.suiteTags;
  }

  static set isDebugMode(isDebug) {
    if (!runnerConfigObject.isDebugMode && isDebug) {
      runnerConfigObject.isDebugMode = isDebug;
    }
  }

  static get isDebugMode() {
    return runnerConfigObject.isDebugMode;
  }

  static set retriesNumber(count) {
    if (!runnerConfigObject.retries && count) {
      runnerConfigObject.retries = count;
    }
  }

  static get retriesNumber() {
    return runnerConfigObject.retries;
  }

  static set environment(data) {
    if (!runnerConfigObject.env && data) {
      runnerConfigObject.env = data;
    }
  }

  static get environment() {
    return runnerConfigObject.env;
  }
}

exports.RunnerConfig = RunnerConfig;
