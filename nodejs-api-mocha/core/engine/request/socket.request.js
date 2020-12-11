const { AbstractRequest } = require('./base.request');
const { cloneDeep, get } = require('lodash');
const { LoggerManager } = require('../../log/logger');
const WebSocket = require('ws');

const SUCCESS_EVENT_TYPE = 'onsuccess';
const ERROR_EVENT_TYPE = 'onerror';
const CONNECTED_EVENT_TYPE = 'onconnect';

class WebSocketRequest extends AbstractRequest {
  constructor(config) {
    super();
    this.initConfigService(config);
    this.eventStorage = new Map();
    this.sockets = {};
    this.resolve = {};
  }

  onMessageHandler() {
    return (data) => {
      LoggerManager.debug(null, 'WebSocket onMessage');
      LoggerManager.debug(null, data);
      const msg = JSON.parse(data);
      const { type } = msg;
      const payload = get(msg, 'payload');

      switch (type) {
        case CONNECTED_EVENT_TYPE:
          break;
        case SUCCESS_EVENT_TYPE:
        case ERROR_EVENT_TYPE:
          this.handleSocketMessage(payload);
          break;
        default:
          break;
      }
    };
  }

  handleSocketMessage(payload) {
    if (!payload || !payload.eventId) {
      return;
    }

    const eventHandler = this.getEventHandler(payload.eventId);

    if (!eventHandler) {
      LoggerManager.debug(null, `[WebSocket][EventId=${payload.eventId}] Not have any handler for this eventId`);
      this.eventStorage.set(payload.eventId, { payload });
      return;
    }
    LoggerManager.debug(null, `[WebSocket][EventId=${payload.eventId}] Received data and will Invoke handler`);
    eventHandler.resolve(payload.eventId, payload);
  }

  addEventHandler(eventId, eventResolver) {
    const existingEventHandler = this.getEventHandler(eventId);

    if (existingEventHandler) {
      LoggerManager.debug(null, `[WebSocket][EventId=${eventId}] Already have an existing Event Handler`);
      const cloneEventHandler = cloneDeep(existingEventHandler);
      this.eventStorage.set(eventId, eventResolver);

      this.handleSocketMessage(cloneEventHandler.payload);
    } else {
      LoggerManager.debug(null, `[WebSocket][EventId=${eventId}] Create a handler for this eventId`);
      this.eventStorage.set(eventId, eventResolver);
    }
  }

  getEventHandler(eventId) {
    return this.eventStorage.get(eventId);
  }

  removeEventHandler(eventId) {
    this.eventStorage.delete(eventId);
  }

  onClose(resolve) {
    return () => {
      LoggerManager.debug(null, 'Websocket is closed');
      if (resolve) {
        resolve();
      }
    };
  }

  onOpen(resolve) {
    return () => {
      LoggerManager.debug(null, 'Websocket is opened');
      if (resolve) {
        resolve();
      }
    };
  }

  initWebSocket() {}
  async openConnection(resolve) {
    const token = await this.getAuthenticateToken();
    this.resolve = resolve;
    const socket = new WebSocket(this.currentSocketUrl, {
      headers: {
        Cookie: token
      }
    });
    socket.on('message', this.onMessageHandler());
    socket.on('open', this.onOpen(resolve));
    socket.on('close', this.onClose(resolve));
    this.sockets[this.currentSocketUrl] = socket;
  }

  closeWebSocketConnection(resolve) {
    const socket = this.sockets[this.currentSocketUrl];
    socket.on('close', this.onClose(resolve));
    socket.close();
  }

  get currentSocketUrl() {
    const vendorDomainUrl = this.config.baseVendorUrl.split('//')[1];
    return `wss://${vendorDomainUrl}/connect?namespace=${this.config.namespace}`;
  }
}

exports.WebSocketRequest = WebSocketRequest;
