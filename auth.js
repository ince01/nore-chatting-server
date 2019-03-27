import bcrypt from 'bcrypt';
const LocalStrategy = require('passport-local').Strategy;

import Users from './models/users';

module.exports = (passport) => {
  passport.use(new LocalStrategy(
    (email, password, done) => {

      Users.findOne({
        email: email
      }, (err, user) => {
        const pass = bcrypt.compareSync(password, user.password);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username.'
          });
        }
        if (!pass) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (id, cb) {
    Users.findById(id, function (err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });

}