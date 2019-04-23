import express from 'express';
import http from 'http';
import passport from 'passport';
import { PORT } from './config'
import db from './db';
import router from './routes';
import middlewares from './middlewares';
import passportConfig from './auth';
import socket from './socketIO';

const app = express();

const server = http.Server(app);

//Connect database
db(app);

//Use middleware
middlewares(app);

//Config passport
passportConfig(passport)

//Routes
app.get('/', (req, res) => {
  res.send('Hello world !');
})
app.use(router);

//Config socket.io
socket(server);

//Run server
server.listen(PORT, () => {
  console.log(`nore-server running on port ${server.address().port} ...`);
})

// Handling unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});
