const { ConfigHelper } = require('../../helper/config.helper');

/**
 * @abstract
 */
class BaseConfig {
  constructor(config, isConfigFile = true) {
    this.config = isConfigFile ? ConfigHelper.parsingConfigDataFile(config) : config;
  }
  /**
   *
   * @param {String} configKey
   * @param {String|Number} [defaultValue]
   * Method to allow get config data with specific key
   *
   * Example:
   * getConfigData('port', 22)
   *
   */
  getConfigData(configKey, defaultValue) {
    return ConfigHelper.getConfigValue(this.config, configKey, defaultValue);
  }

  get username() {
    return ConfigHelper.restAuthenticateUserName;
  }

  get password() {
    return ConfigHelper.restAuthenticatePassword;
  }

  get host() {
    return this.getConfigData('host');
  }

  get protocol() {
    return this.getConfigData('protocol', 'sftp');
  }

  get port() {
    return this.getConfigData('port', '22');
  }

  get impersonateUserName() {
    return this.getConfigData('impersonateUserName');
  }

  get namespace() {
    /**
     * Get namespace in cli argument
     * and if config file does not contain namespace value
     * will return data is provided by config file
     * */
    return ConfigHelper.namespace || this.getConfigData('namespace');
  }

  get env() {
    /**
     * Get environment in cli argument
     * and if config file does not contain environment value
     * will return data is provided by config file
     * */
    return ConfigHelper.environment || this.getConfigData('env');
  }

  get invSiteUrl() {
    return this.getConfigData('invSiteUrl');
  }

  get loginAuth() {
    return this.getConfigData('loginAuth');
  }

  get logoutAuth() {
    return this.getConfigData('logoutAuth');
  }
}
exports.BaseConfig = BaseConfig;
