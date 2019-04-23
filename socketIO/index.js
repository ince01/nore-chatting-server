import socketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

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
  });

  io.sockets.on('connection', (socket) => {
    console.log(socket.id + ' connected !')
    socket.on('message', (text, callback) => {
      socket.broadcast.emit('message', text);
      callback && callback();
    })
  });
}

