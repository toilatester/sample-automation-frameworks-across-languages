const fs = require('fs');
const path = require('path');
const { ServiceConfig, SftpConfig } = require('../config/service');

let restServiceConfigFilePath = null;
let sftpServiceConfigFilePath = null;
let appRootPath = null;
let testFolderPath = null;
let rawConfigObject = null;
let rawSftpConfigObject = null;
let debugMode = false;
let restServiceConfigObject = null;
let sftpServiceConfigObject = null;
const checkIfFileHasContainTag = (tagNames, tag) => {
  tag = tag.replace(/'/gm, '');
  if (tagNames.includes(tag)) {
    return true;
  }
  return false;
};

class RunnerHelper {
  static getAllFileInFolder(folderPath, listFile) {
    fs.readdirSync(folderPath).forEach((f) => {
      const currentPath = path.join(folderPath, f);
      const isDirectory = fs.statSync(currentPath).isDirectory();
      isDirectory ? this.getAllFileInFolder(currentPath, listFile) : listFile.push(currentPath);
    });
  }
  static filterFileByExtensionAndTag(filePath, tags, fileExtension, listTestFiles) {
    RunnerHelper.getAllFileInFolder(filePath, listTestFiles);
    listTestFiles = RunnerHelper.filterFileByExtension(listTestFiles, fileExtension);
    listTestFiles = RunnerHelper.filterFileByTag(listTestFiles, tags);
    return listTestFiles;
  }

  static filterFileByTag(listFiles, tagNames) {
    // return all file if run without tags
    if (!tagNames.length) {
      return listFiles;
    }
    return listFiles.filter((file) => {
      const hasRawTagsInTestFile = fs
        .readFileSync(file)
        .toString()
        .match(/.*exports.TAGS.*;/gm);
      // Will add default tag if not define tag
      const rawTagsInTestFile = hasRawTagsInTestFile || `["'${tagNames[0]}'"]`;
      const listTagsInFile = rawTagsInTestFile.toString().match(/'(-*\w\s*)+'/gm);
      /**
       * Check if file contains tag to run
       * It will return the array contain boolean
       * If file contains tag
       */
      const fileHasTagToRunMapping = listTagsInFile.map((tag) => {
        return checkIfFileHasContainTag(tagNames, tag);
      });

      return fileHasTagToRunMapping.includes(true);
    });
  }

  static filterFileByExtension(listFiles, extension) {
    return listFiles.filter((file) => {
      const fileName = path.basename(file);
      return fileName.substr(-3) === extension;
    });
  }

  static isContainMethod(object, method) {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(object));
    return methods.includes(method);
  }

  static getServiceConfig() {
    // Singleton instance service config object one time
    // Avoid having memory leak
    if (!restServiceConfigObject) restServiceConfigObject = new ServiceConfig(RunnerHelper.restServiceConfigFilePath);
    if (RunnerHelper.restServiceConfigFilePath) return restServiceConfigObject;
    return RunnerHelper.getDebugModeConfig();
  }

  static getServiceConfigFromJson(configObject) {
    if (!rawConfigObject) rawConfigObject = configObject;
    return new ServiceConfig(rawConfigObject, false);
  }

  static getSftpConfig() {
    if (!sftpServiceConfigObject) sftpServiceConfigObject = new SftpConfig(RunnerHelper.sftpServiceConfigFilePath);
    return sftpServiceConfigObject;
  }

  static getSftpConfigFromJson(configObject) {
    rawSftpConfigObject = rawSftpConfigObject || configObject;
    return new SftpConfig(rawSftpConfigObject, false);
  }

  static getDebugModeConfig() {
    try {
      const debugConfigPath = path.join(
        path.resolve(__dirname),
        '..',
        '..',
        'config',
        'runner',
        'rest.service',
        'debug.config.json'
      );
      return new ServiceConfig(debugConfigPath);
    } catch (error) {
      throw new Error('Missing debug.config.json file in config folder');
    }
  }

  static get restServiceConfigFilePath() {
    return restServiceConfigFilePath;
  }

  static set restServiceConfigFilePath(filePath) {
    // Check to allow set config file path one time when executing test
    if (!restServiceConfigFilePath && filePath) {
      restServiceConfigFilePath = filePath;
    }
  }

  static get sftpServiceConfigFilePath() {
    return sftpServiceConfigFilePath;
  }

  static set sftpServiceConfigFilePath(filePath) {
    // Check to allow set config file path one time when executing test
    if (!sftpServiceConfigFilePath && filePath) {
      sftpServiceConfigFilePath = filePath;
    }
  }

  static get appRootPath() {
    return appRootPath;
  }

  static set appRootPath(rootPath) {
    // Check to allow set config file path one time when executing test
    if (!appRootPath && rootPath) {
      appRootPath = rootPath;
    }
  }

  static get testFolderPath() {
    return testFolderPath;
  }

  static set testFolderPath(folderPath) {
    // Check to allow set config file path one time when executing test
    if (!testFolderPath && folderPath) {
      testFolderPath = folderPath;
    }
  }

  static get debugMode() {
    return debugMode;
  }

  static set debugMode(mode) {
    debugMode = mode;
  }

  static deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = `${folderPath}/${file}`;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          RunnerHelper.deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    }
  }
}

exports.RunnerHelper = RunnerHelper;
