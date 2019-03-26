import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';

import db from './db';
import router from './routes';

const app = express();

const server = http.Server(app);

const io = socketIo(server);

const port = process.env.PORT || 5000;

//connect db
db(app);

//middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world !');
})

const MongoStore = require('connect-mongo')(session);

//session
app.use(session({
  secret: 'secret-key',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

//route
app.use(router);

//socket
io.on('connection', function (socket) {
  console.log(`a user connected with id: ${socket.id}`);
  socket.on('disconnect', function () {
    console.log(`a user disconnected with id: ${socket.id}`);
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
    const message = new Message({
      "message": msg
    });
    message.save()
      .try(function (result) {
        console.log(result)
      })
      .catch(function (err) {
        console.log(err);
      })
  });
})

server.listen(port, () => {
  console.log(`nore-server running on port ${port} ...`);
})