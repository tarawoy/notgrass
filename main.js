const WebSocket = require('ws');
const uuid = require('uuid');
const { faker } = require('@faker-js/faker'); // Updated to use the new faker package
const log = require('loglevel');
const readline = require('readline');

// Configure logger
log.setLevel('info');

// Utility to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Random delay helper
const randomDelay = (min, max) => new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

// Main WebSocket connection function
async function connectToWSS(userId) {
  const randomUserAgent = faker.internet.userAgent();
  const deviceId = uuid.v4();
  log.info(`Generated Device ID: ${deviceId}`);
  const uriList = [
    "wss://proxy2.wynd.network:4444/",
    "wss://proxy2.wynd.network:4650/",
  ];

  while (true) {
    try {
      await randomDelay(100, 1000);

      const uri = uriList[Math.floor(Math.random() * uriList.length)];
      log.info(`Connecting to URI: ${uri}`);

      const options = {
        headers: {
          "User-Agent": randomUserAgent,
        },
        rejectUnauthorized: false, // Ignore SSL verification
      };

      const ws = new WebSocket(uri, options);

      ws.on('open', () => {
        log.info('Connected to WebSocket server');

        // Periodically send PING
        const sendPing = () => {
          const pingMessage = JSON.stringify({
            id: uuid.v4(),
            version: "1.0.0",
            action: "PING",
            data: {},
          });
          log.debug(`Sending PING: ${pingMessage}`);
          ws.send(pingMessage);
        };
        setInterval(sendPing, 5000);
      });

      ws.on('message', async (data) => {
        const message = JSON.parse(data);
        log.info(`Received message: ${JSON.stringify(message)}`);

        if (message.action === "AUTH") {
          const authResponse = {
            id: message.id,
            origin_action: "AUTH",
            result: {
              browser_id: deviceId,
              user_id: userId,
              user_agent: randomUserAgent,
              timestamp: Math.floor(Date.now() / 1000),
              device_type: "desktop",
              version: "4.28.2",
            },
          };
          log.debug(`Sending AUTH response: ${JSON.stringify(authResponse)}`);
          ws.send(JSON.stringify(authResponse));
        } else if (message.action === "PONG") {
          const pongResponse = {
            id: message.id,
            origin_action: "PONG",
          };
          log.debug(`Sending PONG response: ${JSON.stringify(pongResponse)}`);
          ws.send(JSON.stringify(pongResponse));
        }
      });

      ws.on('error', (err) => {
        log.error(`WebSocket error: ${err.message}`);
      });

      ws.on('close', () => {
        log.warn('WebSocket connection closed. Reconnecting...');
      });
    } catch (err) {
      log.error(`Error occurred: ${err.message}`);
    }
  }
}

// Main function
(async () => {
  rl.question('Please Enter your user ID: ', async (userId) => {
    rl.close();
    await connectToWSS(userId);
  });
})();
