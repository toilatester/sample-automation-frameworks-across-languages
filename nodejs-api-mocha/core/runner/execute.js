const Mocha = require('mocha');
const path = require('path');
const { RunnerHelper } = require('../helper/runner.helper');

const GlobalHook = require.resolve('./hook');

const filterListTestFiles = (filePath, isSingleFile, fileExtension) => {
  let listTestFiles = [];
  if (Array.isArray(filePath)) {
    listTestFiles = filePath;
  } else if (!isSingleFile) {
    listTestFiles = RunnerHelper.filterFileByExtensionAndTag(filePath, this.tags, fileExtension, listTestFiles);
  } else {
    listTestFiles.push(filePath);
  }
  return listTestFiles;
};

const cleanCacheTestFiles = (listTestFiles) => {
  listTestFiles.forEach((testFilePath) => {
    console.log(`Reset state ${testFilePath} before run retries`); // eslint-disable-line no-console
    Object.keys(require.cache).forEach((currentCacheFilePath) => {
      const cacheFileName = path.basename(currentCacheFilePath);
      const retriesTestFileName = path.basename(testFilePath);
      if (cacheFileName === retriesTestFileName) {
        delete require.cache[currentCacheFilePath];
      }
    });
  });
};

class Execute {
  constructor({ isRetries }) {
    this.completeCallBack = [
      async (...args) => {
        process.exitCode = args[0] ? 1 : 0;
      }
    ];
    this.isRetries = isRetries;
    this.tags = [];
    this.runner = {};
    this.mocha = new Mocha();
    this.mocha.addFile(GlobalHook);
  }

  addTestFiles(filePath, fileExtension, isSingleFile = false) {
    const listTestFiles = filterListTestFiles(filePath, isSingleFile, fileExtension);
    if (this.isRetries) {
      cleanCacheTestFiles(listTestFiles);
    }
    console.log(`Execute suite with ${listTestFiles.length} test files`); // eslint-disable-line no-console
    listTestFiles.forEach((file) => {
      console.log(`Add ${file} into suite `); // eslint-disable-line no-console
      this.mocha.addFile(file);
    });
    return this;
  }

  addTag(tag) {
    this.tags = this.tags.concat(tag);
    return this;
  }

  addCompleteCallBack(completeCallBack) {
    this.completeCallBack.push(completeCallBack);
    return this;
  }

  addReporter(reportType, reportOptions) {
    this.mocha.reporter(reportType, reportOptions);
    return this;
  }

  addTestListener(listener) {
    if (RunnerHelper.isContainMethod(listener, 'listen')) {
      listener.runner = this.runner;
      listener.listen();
    }
    return this;
  }

  setTimeout(timeout) {
    const config = RunnerHelper.getServiceConfig();
    timeout = timeout || config.timeout;
    this.mocha.timeout(timeout);
    return this;
  }

  run(
    runnerConfig = {
      listener: { runner: () => {}, listen: () => {} }
    },
    maxListeners = 512
  ) {
    /**
     * Default Node.JS allow maximum 10 listeners add to EventEmmiter
     * and we set it to 100 for allowing multiple listeners use in log
     *
     * */
    process.setMaxListeners(maxListeners);
    this.runner = this.mocha.run((...args) => {
      this.completeCallBack.forEach((callbackComplete) => {
        callbackComplete(...args);
      });
    });
    this.addTestListener(runnerConfig.listener);
    return this;
  }
}

exports.Execute = Execute;
