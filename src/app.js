import http from 'http';
import path from 'path';

import express from 'express';
import morgan from 'morgan';
import socketIo from 'socket.io';

const app = express();

const server = http.createServer(app);
const io = socketIo.listen(server);

import sockets from './sockets';

// configurations
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public/index.html');
  res.sendFile(indexPath);
});

app.get('/onlineusers', (req, res) => {
  res.send(io.sockets.adapter.rooms);
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

// sockets
sockets(io);

// bootstraping the app
server.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});
