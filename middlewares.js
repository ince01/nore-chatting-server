import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';

const MongoStore = require('connect-mongo')(session);

module.exports = (app) => {
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(bodyParser.json())

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
}


