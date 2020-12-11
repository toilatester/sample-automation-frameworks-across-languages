const { BaseConfig } = require('./base.config');

class ServiceConfig extends BaseConfig {
  get baseUrl() {
    return this.getConfigData('baseUrl');
  }

  get timeout() {
    return this.getConfigData('timeout', 10000);
  }

  get loginDomain() {
    return this.getConfigData('loginDomain', 'authdomain');
  }
}

exports.ServiceConfig = ServiceConfig;
