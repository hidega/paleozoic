/* globals window: true */

(function() {
  'use strict';

  function WebsocketClient(url, h, p) {
    var self = this;

    var socket = new WebSocket(url);

    var reconnect = function() { socket = new WebSocket(url); };

    var handlers = {
      close: h.close || function() {},
      error: h.error || function(e) { console.error('ws error', e); },
      message: h.message || function() {},
      open: h.open || function() {}
    };

    socket.onerror = function(event) { handlers.error(event, reconnect); };
    socket.onclose = function(event) { handlers.close(event.code, event, reconnect); };
    socket.onmessage = function(event) { handlers.message(event.data, event); };
    socket.onopen = handlers.open;

    WebSocket.binaryType = 'blob';

    self.startDate = Object.freeze(Date.now());

    self.send = function(data) { socket.send(data); };

    self.dispose = function() {
      reconnect = function() {};
      socket.close();
      socket = false;
      self.send = function() {};
      self.dispose = function() {};
    };

    self.getBufferedAmount = function() { return socket.bufferedAmount; };

    self.getConnectionState = function() { return socket.readyState; };
  }

  if(!window.permian) {
    window.permian = {};
  }

  window.permian.WebsocketClient = WebsocketClient;
})();
