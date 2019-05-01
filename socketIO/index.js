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

    socket.on('message', (message) => {

      Messages.create(message, (err, data) => {
        if (err) {
          console.log(err);
          return new Error('Something went wrong!');
        };
        console.log(data);
      });

      socket.to(message.to).broadcast.emit('new-message', message);

    })

    socket.on('disconnect', (reason) => {
      console.log(`${socket.id} disconnected: ${reason}`);
    })

  })
}

