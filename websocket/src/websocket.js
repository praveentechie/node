const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
// const cors = require('cors')

const DIST_DIR = 'dist';

const app = express();
// app.use(cors())

app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

const verifyClient = (info) => {
  console.log('ding dong')
  return true
}

const httpServer = http.createServer(app);
const websocketServer = new WebSocket.Server({ server: httpServer, verifyClient });

websocketServer.on('connection', function connection(websocket, req) {
  console.log('ws.upgradeReq', req.socket.remoteAddress);
  // const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  websocket.on('message', function incoming(message) {
    console.log('received: %s', message);
    websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  websocket.on('close', function (connection) {
    console.log('closed!!!', connection);
  });

  // websocket.send('something');
});

httpServer.listen(8080, function listening() {
  console.log('Listening on %d', httpServer.address().port);
});