'use strict';

const mockServers = [];
const messageType = {
  REQUEST: 'REQUEST',
  MOCK_RESPONSE: 'MOCK_RESPONSE',
  REGISTER_MOCK_SERVER: 'REGISTER_MOCK_SERVER',
  START_MOCK_SERVER: 'START_MOCK_SERVER',
  STOP_MOCK_SERVER: 'STOP_MOCK_SERVER',
  UNKNOWN_MESSAGE: 'UNKNOWN_MESSAGE'
};

self.addEventListener('install', onInstallSmartMockServer);
self.addEventListener('activate', onActivateSmartMockServer);
self.addEventListener('message', onMessageSmartMockServer);
self.addEventListener('fetch', onFetchSmartMockServer);

/**
 *
 * @param evt
 */
function onInstallSmartMockServer(evt) { // eslint-disable-line no-unused-vars
  return self.skipWaiting();
}

/**
 *
 * @param evt
 */
function onActivateSmartMockServer(evt) { // eslint-disable-line no-unused-vars
  return self.clients.claim();
}

/**
 *
 * @param evt
 */
function onMessageSmartMockServer(evt) {
  try {
    const type = evt.data.type;
    if (type === messageType.REGISTER_MOCK_SERVER) {
      registerMockServers(evt.data.payload);
    } else if (type === messageType.START_MOCK_SERVER || type === messageType.STOP_MOCK_SERVER) {
      setMockServerStatus(evt.data.payload);
    }
  } catch (err) {
    console.error(err); // eslint-disable-line
  }
}

/**
 *
 * @param evt
 */
function onFetchSmartMockServer(evt) {
  const server = getMockServer(evt.request);
  const mockRequest = getMockRequest(evt.request, server);
  if (!mockRequest) {
    return;
  }

  let xhr = null;
  evt.respondWith(
      buildXhrRequest(evt.request, server, mockRequest)
          .then(function(mockRequest) {
            xhr = mockRequest;
            return evt.target.clients.get(evt.clientId);
          })
          .then(function(client) {
            return sendToClient(client, xhr);
          })
          .then(function(mockResponse) {
            return buildResponse(mockResponse.payload);
          })
          .catch(function(err) {
            console.error(err); // eslint-disable-line
            return buildErrorResponse();
          })
  );
}

/**
 *
 * @param client
 * @param message
 */
function sendToClient(client, message) {
  return new Promise(function(resolve, reject) {
    const channel = new MessageChannel();
    channel.port1.onmessage = function(evt) {
      if (evt.data && evt.data.error || evt.data.type !== messageType.MOCK_RESPONSE) {
        reject(evt.data.error || messageType.UNKNOWN_MESSAGE);
      } else {
        resolve(evt.data);
      }
    };
    client.postMessage({
      type: messageType.REQUEST,
      payload: JSON.stringify(message)
    }, [channel.port2]);
  });
}

/**
 *
 * @param headers
 */
function extractHeaders(headers) {
  const mockHeaders = {};
  headers.forEach(function(value, key) {
    mockHeaders[key] = mockHeaders[key] ? [].concat(mockHeaders[key]).concat(value) : value;
  });
  return mockHeaders;
}

/**
 *
 * @param xhrHeaders
 */
function buildHeaders(xhrHeaders) {
  const headers = new Headers();
  Object.keys(xhrHeaders).forEach(function(key) {
    headers.append(key.toString(), xhrHeaders[key]);
  });
  return headers;
}

/**
 *
 * @param payload
 */
function registerMockServers(payload) {
  const servers = JSON.parse(payload);
  if (servers.length) {
    servers.forEach(function(server) {
      server.requests.forEach(function(request) {
        request.pathRegExp = new RegExp(request.path);
      });
      mockServers.push(server);
    });
  }
}

/**
 *
 * @param payload
 */
function setMockServerStatus(payload) {
  const serverInfo = JSON.parse(payload);
  mockServers
      .filter(function(server) {
        return server.rootUri === serverInfo.rootUri;
      })
      .forEach(function(server) {
        server.active = serverInfo.active;
      });
}

/**
 *
 * @param originalRequest
 */
function getMockServer(originalRequest) {
  return mockServers.find(function(server) {
    const regxp = new RegExp(server.rootUri);
    return server.active && regxp.test(originalRequest.url);
  });
}

/**
 *
 * @param originalRequest
 * @param server
 */
function getMockRequest(originalRequest, server) {
  if (!server) {
    return;
  }
  return server.requests
      .filter(function(req) {
        return req.method.toLowerCase() === originalRequest.method.toLowerCase() && req.pathRegExp.test(originalRequest.url);
      })
      .find(function(req, i, reqs) {
        return reqs.length === 1 || (reqs.length > 1 && req.path !== '$');
      });
}

/**
 *
 * @param originalRequest
 * @param server
 * @param mockRequest
 */
function buildXhrRequest(originalRequest, server, mockRequest) {
  return originalRequest.text()
      .then(function(body) {
        return {
          async: true,
          readyState: 1,
          requestBody: body,
          method: originalRequest.method,
          requestHeaders: extractHeaders(originalRequest.headers),
          url: originalRequest.url,
          mockServer: {
            path: mockRequest.path
          }
        };
      });
}

/**
 *
 * @param payload
 */
function buildResponse(payload) {
  const xhrResponse = JSON.parse(payload);
  return new Response(xhrResponse[2] || null, {
    status: xhrResponse[0] || 500,
    // statusText: 'This is a fake response from SmartMockServer!',
    headers: buildHeaders(xhrResponse[1] || {})
  });
}

/**
 *
 */
function buildErrorResponse() {
  return new Response(null, {
    status: 500,
    statusText: 'Something wrong happened when trying to mock this request!',
    headers: {}
  });
}
