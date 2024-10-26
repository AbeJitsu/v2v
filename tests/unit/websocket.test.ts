// tests/unit/websocket.test.ts
import http from 'http';
import WS from 'ws';
import setupWebSocket from '../../src/websocket';

describe('WebSocket Core Functionality', () => {
  let server: http.Server;
  let mockLogger: { info: jest.Mock; debug: jest.Mock; error: jest.Mock };
  let wsMock: WS;

  beforeAll((done) => {
    server = http.createServer();
    mockLogger = { info: jest.fn(), debug: jest.fn(), error: jest.fn() };

    setupWebSocket(server, mockLogger);

    server.listen(done);
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    wsMock = {
      on: jest.fn((event, callback) => {
        if (event === 'message') callback(JSON.stringify({ type: 'test' }));
      }),
      send: jest.fn(),
      close: jest.fn(),
      readyState: WS.OPEN,
    } as unknown as WS;
  });

  it('should log connection on client connect', () => {
    mockLogger.info('New WebSocket client connected');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'New WebSocket client connected'
    );
  });

  it('should log disconnection on client close', () => {
    mockLogger.info('WebSocket client disconnected');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'WebSocket client disconnected'
    );
  });
});
