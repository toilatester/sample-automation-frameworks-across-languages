const fs = require('fs');

let restAuthenticateUsername = null;
let restAuthenticatePassword = null;
let listAlternativeAccount = null;
let sftpAuthenticateUsername = null;
let sftpAuthenticatePassword = null;
let namespace = null;
let env = null;
const convertToListAlternativeAccount = (data) => {
  try {
    const alternativeAccounts = {};
    data.forEach((element) => {
      const accountInfo = element.split(':');
      const keyAccount = accountInfo[0];
      const accountData = accountInfo[1].split('/');
      alternativeAccounts[keyAccount] = {
        username: accountData[0],
        password: accountData[1]
      };
    });
    return alternativeAccounts;
  } catch (err) {
    const errorMessage = `Has error in process list alternative accounts ${err}`;
    const usageMessage = ' --alternativeAccounts keyAccount1:username1/password1 keyAccount2:username2/password2';
    throw new Error(`${errorMessage}, alternativtAccount allow input format ${usageMessage}`);
  }
};
class ConfigHelper {
  static getConfigValue(objectData, configKey, defaultValue) {
    // Check if first time generate config value in config.json data
    // Or get value from ServiceConfig Object again
    const isServiceConfigObject =
      objectData.constructor.name === 'ServiceConfig' || objectData.constructor.name === 'SftpConfig';
    const configValue = isServiceConfigObject ? objectData.config[configKey] : objectData[configKey];
    const isReturnDefaultValue = !configValue && defaultValue;
    const isThrowException = !(configValue || defaultValue);
    if (isReturnDefaultValue) return defaultValue;
    if (isThrowException) throw new Error(`Config data ${JSON.stringify(objectData)} is invalid with key ${configKey}`);
    return configValue;
  }

  static parsingConfigDataFile(configPath) {
    try {
      return JSON.parse(fs.readFileSync(configPath));
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`No such file or directory at "${configPath}", please check the config path again`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Syntax Error: ${error.message} at file ${configPath}`);
      }
      throw new Error(`${error.name} ${error.message}`);
    }
  }

  static set restAuthenticateUserName(username) {
    if (!restAuthenticateUsername && username) {
      restAuthenticateUsername = username;
    }
  }

  static get restAuthenticateUserName() {
    if (restAuthenticateUsername) return restAuthenticateUsername;
    throw new Error('Missing authenticate data when run test, run test with argument --username your_username');
  }

  static set restAuthenticatePassword(password) {
    if (!restAuthenticatePassword && password) {
      restAuthenticatePassword = password;
    }
  }

  static get restAuthenticatePassword() {
    if (restAuthenticatePassword) return restAuthenticatePassword;
    throw new Error('Missing authenticate data when run test, run test with argument --password your_password');
  }

  static set sftpAuthenticateUserName(username) {
    if (!sftpAuthenticateUsername && username) {
      sftpAuthenticateUsername = username;
    }
  }

  static get sftpAuthenticateUserName() {
    if (sftpAuthenticateUsername) return sftpAuthenticateUsername;
    throw new Error('Missing authenticate data when run test, run test with argument --username your_username');
  }

  static set sftpAuthenticatePassword(password) {
    if (!sftpAuthenticatePassword && password) {
      sftpAuthenticatePassword = password;
    }
  }

  static get sftpAuthenticatePassword() {
    if (sftpAuthenticatePassword) return sftpAuthenticatePassword;
    throw new Error('Missing authenticate data when run test, run test with argument --password your_password');
  }

  static set listAuthenticateAccount(account) {
    if (!listAlternativeAccount && account) {
      listAlternativeAccount = convertToListAlternativeAccount(account);
    }
  }

  static get listAuthenticateAccount() {
    if (listAlternativeAccount) return listAlternativeAccount;
    return {};
  }

  static set namespace(name) {
    if (!namespace && name) {
      namespace = name;
    }
  }

  static get namespace() {
    return namespace;
  }

  static set environment(data) {
    if (!env && data) {
      env = data;
    }
  }

  static get environment() {
    return env;
  }
}

exports.ConfigHelper = ConfigHelper;
