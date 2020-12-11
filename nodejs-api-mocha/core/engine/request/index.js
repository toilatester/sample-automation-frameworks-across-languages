const { RestRequest } = require('./rest.request');
const { SftpRequest } = require('./sftp.request');
const { WebSocketRequest } = require('./socket.request');

exports.RestRequest = RestRequest;
exports.SftpRequest = SftpRequest;
exports.WebSocketRequest = WebSocketRequest;
