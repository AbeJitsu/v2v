import WS from 'ws';

let clients: WS[] = [];

const setupWebSocket = (server: any, logger: any): void => {
  const wss = new WS.Server({ server });

  wss.on('connection', (ws: WS) => {
    clients.push(ws);
    logger.info('New WebSocket client connected');

    ws.on('message', (message: WS.Data) => handleMessage(message, logger));
    ws.on('close', () => handleDisconnection(ws, logger));
    ws.on('error', (error: Error) => logger.error('WebSocket error:', error));
  });

  const handleMessage = (message: WS.Data, logger: any): void => {
    logger.debug('Received WebSocket message:', message);
    try {
      const data = JSON.parse(message.toString());
      broadcast(data);
    } catch (error) {
      logger.error('Error parsing WebSocket message:', error);
    }
  };

  const handleDisconnection = (ws: WS, logger: any): void => {
    logger.info('WebSocket client disconnected');
    clients = clients.filter((client) => client !== ws);
  };

  const broadcast = (data: any): void => {
    clients.forEach((client) => {
      if (client.readyState === WS.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
};

export default setupWebSocket;
