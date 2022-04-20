import http from "http";
import app from "./app.js";
import { Server as SocketServer } from "socket.io";
import sockets from "./sockets.js";
import { PORT } from "./config.js";

const server = http.createServer(app);
const io = new SocketServer(server);

app.set("io", io);

// sockets
sockets(io);

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
