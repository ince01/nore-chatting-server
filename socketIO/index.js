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

      socket.rom = decoded.id;
      next();
    });
  })

  io.sockets.on('connection', (socket) => {

    console.log(socket.rom)

    // socket.on('message', (message) => {

    //   console.log(message)

    //   Messages.create(message, (err, data) => {
    //     if (err) {
    //       console.log(err);
    //       return new Error('Something went wrong!');
    //     };
    //   });

    //   socket.join(`Room-${message.to}`);

    //   console.log(socket.rooms)

    //   // console.log(io)

    //   io.to(`Room-${message.to}`).emit("newMessage", message.content)
    //   // socket.on("newMessage", (data) => { console.log(data) })

    // })

    socket.join(socket.rom, () => {
      // console.log(Object.keys(socket.rooms)); // [ <socket.id>, 'room 237' ]
      // io.to(rooms).emit('a new user has joined the room');
    });
    socket.on('SEND_MESSAGE', function (data) {
      console.log(data);
      io.to(socket.rom).emit('MESS', {
        type: 1,
        mess: data.mess,
        id: data.id
      });
      io.to(data.id).emit('MESS',
        {
          type: 0,
          mess: data.mess,
          id: socket.rom
        }
      );
    })


    socket.on('disconnect', (reason) => {
      // console.log(`${socket.id} disconnected: ${reason}`);
    })

  })
}

