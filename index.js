import express from 'express';
import http from 'http';
import passport from 'passport';
import { PORT } from './config'
import socketIo from 'socket.io';
import db from './db';
import router from './routes';
import middlewares from './middlewares';
import passportConfig from './auth';

const app = express();

const server = http.Server(app);

const io = socketIo(server);

//Connect database
db(app);

//Use middleware
middlewares(app);

//Config passport
passportConfig(passport)

//Routes
app.use(router);
app.get('/', (req, res) => {
  res.send('Hello world !');
})

//SocketIO
io.on('connection', function (socket) {
  console.log(`a user connected with id: ${socket.id}`);
  socket.on('disconnect', function () {
    console.log(`a user disconnected with id: ${socket.id}`);
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
    // const message = new Message({
    //   "message": msg
    // });
    // message.save()
    //   .try(function (result) {
    //     console.log(result)
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   })
  });
})

//Run server
server.listen(PORT, () => {
  console.log(`nore-server running on port ${server.address().port} ...`);
})

// Handling unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});