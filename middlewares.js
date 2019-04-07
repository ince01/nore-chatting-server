import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

const MongoStore = require('connect-mongo')(session);

module.exports = (app) => {
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  app.use(helmet());

  app.use(cors({
    // origin: ["http://localhost:3001"],
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(compression());

  app.use(morgan('dev'));

  //session
  app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
}