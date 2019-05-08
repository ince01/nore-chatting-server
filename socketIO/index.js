import socketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { Messages } from '../models';

module.exports = (server) => {
  const io = socketIo.listen(server, { httpCompression: true });

  io.use((socket, next) => {
    let token = socket.handshake.query.token;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error(err));
      }

      socket.id = decoded.id;
      next();
    });
  })

  io.sockets.on('connection', (socket) => {

    console.log(socket.id)

    socket.on('message', (message) => {

      console.log(message)

      Messages.create(message, (err, data) => {
        if (err) {
          console.log(err);
          return new Error('Something went wrong!');
        };
      });

      socket.join(`Room-${message.to}`);

      console.log(socket.rooms)

      // console.log(io)

      io.to(`Room-${message.to}`).emit("newMessage", message.content)
      // socket.on("newMessage", (data) => { console.log(data) })

    })


    socket.on('disconnect', (reason) => {
      // console.log(`${socket.id} disconnected: ${reason}`);
    })

  })
}

