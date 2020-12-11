const addSubConfig = (object, configKey, subConfigKey, subConfigValue) => {
  if (Object.keys(object.__executionConfig).includes(configKey)) {
    Object.assign(object.__executionConfig[configKey], { [subConfigKey]: subConfigValue });
    return object;
  }
  object.__executionConfig[configKey] = { [subConfigKey]: subConfigValue };
  return object;
};

const extendHelperConfig = ({ require, engine, ...config }) => {
  return {
    require,
    engine,
    ...config
  };
};
class ExecuteConfigBuilder {
  constructor() {
    this.__executionConfig = {};
    this.__defaultWebDriverConfig = {
      protocol: 'http',
      host: 'localhost',
      port: 4444,
      path: '/wd/hub'
    };
    this.__defaultRunConfig = {
      url: 'http://localhost',
      headless: false,
      defaultHeaders: {},
      endpoint: ''
    };
    this.__defaultTimeout = {
      timeout: 10000,
      getPageTimeout: 300000,
      waitForAction: 150,
      waitForTimeout: 30000
    };
    this.__defaultViewPortConfig = {
      width: 1920,
      height: 1080,
      isFullScreen: true
    };
  }

  static createConfig() {
    return new ExecuteConfigBuilder();
  }

  build() {
    return this.__executionConfig;
  }

  setHeadless(isHeadless) {
    this.__defaultRunConfig.headless = isHeadless;
    return this;
  }

  setMaximizeWindow(isMaximize) {
    this.__defaultViewPortConfig.isFullScreen = isMaximize;
    return this;
  }

  setWindowWidth(width) {
    this.__defaultViewPortConfig.width = width;
    return this;
  }

  setWindowHeight(height) {
    this.__defaultViewPortConfig.height = height;
    return this;
  }

  setOutPutPath(path) {
    this.__executionConfig.output = path;
    return this;
  }

  setPatternToLocateTests(pattern) {
    this.__executionConfig.tests = pattern;
    return this;
  }

  setReportConfig(reportName, config, reportPath) {
    this.__executionConfig.reportName = reportName;
    this.__executionConfig.mocha = config(reportPath);
    return this;
  }

  setAllStepsInclude(stepsObject) {
    const stepNames = Object.keys(stepsObject);
    const stepNameKey = 'NAME';
    const stepPathKey = 'PATH';
    for (const step of stepNames) {
      this.setStepsInclude(stepsObject[step][stepNameKey], stepsObject[step][stepPathKey]);
    }
    return this;
  }

  setAllPluginsConfig(pluginObject) {
    const pluginsName = Object.keys(pluginObject);
    const pluginNameKey = 'NAME';
    const pluginConfigKey = 'CONFIG';
    for (const plugin of pluginsName) {
      this.setPluginConfig(pluginObject[plugin][pluginNameKey], pluginObject[plugin][pluginConfigKey]);
    }
    return this;
  }

  setAllHelpersExtendConfig(helpersExtendObject) {
    const extendHelpers = Object.keys(helpersExtendObject);
    const pluginNameKey = 'NAME';
    const pluginConfigKey = 'CONFIG';
    for (const helper of extendHelpers) {
      this.setHelperExtendConfig(
        helpersExtendObject[helper][pluginNameKey],
        helpersExtendObject[helper][pluginConfigKey]
      );
    }
    return this;
  }

  setAllEngineConfig(requireEngine, engineObject) {
    const pluginNameKey = 'NAME';
    const pluginConfigKey = 'CONFIG';
    for (const engine of requireEngine) {
      this.setEngineConfig(engineObject[engine][pluginNameKey], engineObject[engine][pluginConfigKey]);
    }
    return this;
  }

  setStepsInclude(stepName, stepPath) {
    addSubConfig(this, 'include', stepName, stepPath);
    return this;
  }

  setEngineConfig(engineName, engineConfig) {
    const config = engineConfig(
      Object.assign(
        {},
        this.__defaultTimeout,
        this.__defaultRunConfig,
        {
          height: this.__defaultViewPortConfig.height,
          width: this.__defaultViewPortConfig.width,
          isFullScreen: this.__defaultViewPortConfig.isFullScreen
        },
        this.__defaultWebDriverConfig
      )
    );
    addSubConfig(this, 'helpers', engineName, config);
    return this;
  }

  setHelperExtendConfig(helperName, configValues) {
    const config = extendHelperConfig(Object.assign({}, configValues));
    addSubConfig(this, 'helpers', helperName, config);
    return this;
  }

  setPluginConfig(pluginName, ...args) {
    const config = Object.assign({}, ...args);
    addSubConfig(this, 'plugins', pluginName, config);
    return this;
  }

  setPageTimeout(timeout) {
    if (Number.isInteger(Number(timeout))) this.__defaultTimeout.getPageTimeout = Number(timeout);
  }

  setWaitForActionTimeout(timeout) {
    if (Number.isInteger(Number(timeout))) this.__defaultTimeout.waitForAction = Number(timeout);
  }

  setWaitForTimeout(timeout) {
    if (Number.isInteger(Number(timeout))) this.__defaultTimeout.waitForTimeout = Number(timeout);
  }

  setTestsFilePattern(pattern) {
    this.__executionConfig.tests = pattern;
    return this;
  }

  setOutPutFolderPath(path) {
    this.__executionConfig.output = path;
    return this;
  }
}

exports.ExecuteConfigBuilder = ExecuteConfigBuilder;
