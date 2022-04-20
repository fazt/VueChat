export default (io) => {
  io.on("connection", (socket) => {
    // Log a new user connected
    console.log(`A new Used Connected ${socket.id}`);

    // tell all clients that someone connected
    io.emit("user joined", socket.id);

    //the client sends 'chat:message event'
    socket.on("chat:message", function (message) {
      // Emit this Event to all clients connected
      io.emit("chat:message", message);
    });

    //client sends "user typing" event to server
    socket.on("user typing", function (username) {
      io.emit("user typing", username);
    });

    //client sends "stopped typing" event to server
    socket.on("stopped typing", function (username) {
      io.emit("stopped typing", username);
    });

    // when a new user is disconnected
    socket.on("disconnect", function () {
      console.log(`User left ${socket.id}`);

      //tell all clients that someone disconnected
      socket.broadcast.emit("user left", socket.id);
    });
  });
};
