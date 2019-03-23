import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import router from './routes';

const app = express();

const server = http.Server(app);

const io = socketIo(server);

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

const dbUri = 'mongodb://admin:F7WU2t8dSktzqen@ds121026.mlab.com:21026/nore-chatting-app';

const options={
  useNewUrlParser: true,
}

mongoose.connect(dbUri, options, (error) => {
  console.log(`Can't connect database! (Message: ${error.message}`)
});

app.get('/', (req, res) => {
  res.send('Hello world !');
})

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
      const message = new Message({"message":msg});
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