const { REQUEST_SERVICE } = require('../engine');
const { RunnerHelper } = require('../helper/runner.helper');

class BaseService {
  constructor() {
    this.config = RunnerHelper.getServiceConfig();
    this.sftpConfig = RunnerHelper.getSftpConfig();
    this.storeKeys = this.config.storeKeys;
    this._request = null;
    this._recipeRequest = null;
    this._vendorRequest = null;
    this._authdomainRequest = null;
    this._sftpRequest = null;
    this._storeKey = this.storeKeys[0];
    this._otherStoreKey = null;
  }

  get request() {
    if (!this._request) {
      this._request = REQUEST_SERVICE.INVENTORY_SERVICE(this.config);
    }
    return this._request;
  }

  get sftpRequest() {
    this._sftpRequest = this._sftpRequest || REQUEST_SERVICE.SFTP_SERVICE(this.sftpConfig);
    return this._sftpRequest;
  }

  get webSocket() {
    return REQUEST_SERVICE.SOCKET_SERVICE(this.config);
  }

  get storeKey() {
    return this._storeKey;
  }

  set storeKey(key) {
    this._storeKey = key;
  }

  get otherStoreKey() {
    this._otherStoreKey = this.storeKeys[1];
    return this._otherStoreKey;
  }

  set otherStoreKey(key) {
    this._otherStoreKey = key;
  }

  get storeKeyWithoutProdLicense() {
    return this.config.storeKeyWithoutProdLicense;
  }

  resourceUrl() {
    return '';
  }

  resourceUrlWithStoreKey() {
    return `${this.storeKey}/${this.resourceUrl()}`;
  }

  /**
   * @protected
   * @param boundary
   * @return {Object}
   */
  getFormDataHeader(boundary) {
    return { 'Content-Type': `multipart/form-data; boundary=${boundary}` };
  }
}

module.exports = BaseService;
