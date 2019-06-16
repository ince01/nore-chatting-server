import socketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { Messages, Users } from '../models';

module.exports = (server) => {
  const io = socketIo.listen(server, { httpCompression: true });

  io.use((socket, next) => {
    let token = socket.handshake.query.token;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error(err));
      }

      socket.roomName = decoded.id;
      next();
    });
  })

  io.sockets.on('connection', (socket) => {
    //Join room
    socket.join(socket.roomName);

    socket.on('FRIEND_REQUEST', (data) => {
      io.to(data.id).emit('NEW_REQUEST', data);
      console.log('NEW_REQUEST', data)
    })

    socket.on('FRIEND_ACCECPT', (data) => {
      console.log('NEW_FRIEND', socket.roomName)
      io.to(data.id).emit('NEW_FRIEND', data);
      io.to(socket.roomName).emit('NEW_FRIEND', data);
    })

    socket.on('SEND_MESSAGE', (data) => {
      //Save message
      const messObject = {
        idUser: socket.roomName,
        idUserChatting: data.id,
        type: 1,
        content: data.mess
      }
      const messObject1 = {
        idUser: data.id,
        idUserChatting: socket.roomName,
        type: 0,
        content: data.mess
      }
      Messages.insertMany([messObject, messObject1], (err) => {
        if (err)
          throw err;
        else {
          //Emit data
          io.to(socket.roomName).emit('MESS', {
            type: 1,
            mess: data.mess,
            id: data.id
          });
          io.to(data.id).emit('MESS', {
            type: 0,
            mess: data.mess,
            id: socket.roomName
          });
        }
      });
    });



    socket.on('disconnect', (reason) => {
      console.log(`${socket.id} disconnected: ${reason}`);
    });
  })
}

