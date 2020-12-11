const { BaseConfig } = require('./base.config');
const { ConfigHelper } = require('../../helper/config.helper');

class SftpConfig extends BaseConfig {
  get username() {
    return ConfigHelper.sftpAuthenticateUserName;
  }

  get password() {
    return ConfigHelper.sftpAuthenticatePassword;
  }
}

exports.SftpConfig = SftpConfig;
