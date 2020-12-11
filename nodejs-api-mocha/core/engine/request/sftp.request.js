const { AbstractRequest } = require('./base.request');
const Client = require('ssh2-sftp-client');
const { assert } = require('chai');
const { LoggerManager } = require('../../log/logger');
const { pick } = require('lodash');

class SftpRequest extends AbstractRequest {
  /**
   * @param {Object} config
   * @param {string} config.host
   * @param {string} config.port
   * @param {string} config.username
   * @param {string} config.password
   */
  constructor(config) {
    super();
    this.initSftpConfigService(config);
    this.isConnected = false;
    this.client = null;
  }
  async initSftpRequest() {
    if (!this.isConnected) {
      this.client = new Client();
      try {
        const config = pick(this, ['host', 'port', 'username', 'password']);
        await this.client.connect(config, 'on');
        this.isConnected = true;
        LoggerManager.info(this.__testContext, 'Connect to SFTP server successful');
      } catch (error) {
        LoggerManager.error(this.__testContext, error);
      }
    }
  }
  async list(remoteFilePath) {
    assert.isTrue(this.isConnected, 'Please call init() before using SFTP request');
    return this.client.list(remoteFilePath);
  }
  async closeSftpRequest() {
    assert.isTrue(this.isConnected, 'Please call init() before using SFTP request');
    await this.client.end();
    this.isConnected = false;
  }
}

exports.SftpRequest = SftpRequest;
