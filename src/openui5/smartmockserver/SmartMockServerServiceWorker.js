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

function onInstallSmartMockServer(evt) {
  'use strict';
  return self.skipWaiting();
}

function onActivateSmartMockServer(evt) {
  'use strict';
  return self.clients.claim();
}

function onMessageSmartMockServer(evt) {
  'use strict';
  try {
    const type = evt.data.type;
    if (type === messageType.REGISTER_MOCK_SERVER) {
      registerMockServers(evt.data.payload);
    } else if (type === messageType.START_MOCK_SERVER || type === messageType.STOP_MOCK_SERVER) {
      setMockServerStatus(evt.data.payload);
    }
  } catch (err) {
    console.error(err);
  }
}

function onFetchSmartMockServer(evt) {
  'use strict';
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
            console.error(err);
            return buildErrorResponse();
          })
  );
}

function sendToClient(client, message) {
  'use strict';
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

function extractHeaders(headers) {
  'use strict';
  const mockHeaders = {};
  headers.forEach(function(value, key) {
    mockHeaders[key] = mockHeaders[key] ? [].concat(mockHeaders[key]).concat(value) : value;
  });
  return mockHeaders;
}

function buildHeaders(xhrHeaders) {
  'use strict';
  const headers = new Headers();
  Object.keys(xhrHeaders).forEach(function(key) {
    headers.append(key.toString(), xhrHeaders[key]);
  });
  return headers;
}

function registerMockServers(payload) {
  'use strict';
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

function setMockServerStatus(payload) {
  'use strict';
  const serverInfo = JSON.parse(payload);
  mockServers
      .filter(function(server) {
        return server.rootUri === serverInfo.rootUri;
      })
      .forEach(function(server) {
        server.active = serverInfo.active;
      });
}

function getMockServer(originalRequest) {
  'use strict';
  return mockServers.find(function(server) {
    const regxp = new RegExp(server.rootUri);
    return server.active && regxp.test(originalRequest.url);
  });
}

function getMockRequest(originalRequest, server) {
  'use strict';
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

function buildXhrRequest(originalRequest, server, mockRequest) {
  'use strict';
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

function buildResponse(payload) {
  'use strict';
  const xhrResponse = JSON.parse(payload);
  return new Response(xhrResponse[2] || null, {
    status: xhrResponse[0] || 500,
    // statusText: 'This is a fake response from SmartMockServer!',
    headers: buildHeaders(xhrResponse[1] || {})
  });
}

function buildErrorResponse() {
  'use strict';
  return new Response(null, {
    status: 500,
    statusText: 'Something wrong happened when trying to mock this request!',
    headers: {}
  });
}
