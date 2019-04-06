import express from 'express';
import http from 'http';
import passport from 'passport';

import socketIo from 'socket.io';

import db from './db';
import router from './routes';

import middlewares from './middlewares';
import passportConfig from './auth';

const app = express();

const server = http.Server(app);

const io = socketIo(server);

const port = process.env.PORT || 5000;

//Connect database
db(app);

//Middleware
middlewares(app);

//Config passport
passportConfig(passport)

app.get('/', (req, res) => {
  res.send('Hello world !');
})

//Routes
app.use(router);
// setTimeout(() => { console.log(passport) }, 500);
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

server.listen(port, () => {
  console.log(`nore-server running on port ${port} ...`);
})