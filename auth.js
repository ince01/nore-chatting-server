import { Strategy, ExtractJwt } from 'passport-jwt';

import Users from './models/users';

module.exports = (passport) => {

  const params = {
    secretOrKey: 'secret-key-jwt',
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
  };

  passport.use(new Strategy(params, (payload, done) => {
    Users.findOne({ _id: payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false)
      }
    })
  }));

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    Users.findById(id, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });

}
