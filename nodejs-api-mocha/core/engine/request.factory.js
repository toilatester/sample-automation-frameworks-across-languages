const { RestRequest, SftpRequest, WebSocketRequest } = require('./request');

const REQUEST_SERVICE = {
  REST_SERVICE: (config) => {
    return new RestRequest(config);
  },
};

exports.REQUEST_SERVICE = REQUEST_SERVICE;
