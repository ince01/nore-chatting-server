import bcrypt from 'bcrypt';
import { Strategy, ExtractJwt } from 'passport-jwt';

import Users from './models/users';

module.exports = (passport) => {

  const params = {
    secretOrKey: 'secret-key',
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
  };

  // console.log(params.jwtFromRequest)

  passport.use(new Strategy(params, (payload, done) => {
    console.log(payload.id)
    Users.findOne({ _id: payload.id }, (err, user) => {
      console.log('hi em ')
      if (err) {
        console.log(err);
        console.log(user)
        return done(err, false);
      }
      if (user) {
        console.log(user);
        return done(null, user);
      } else {
        console.log('FAIL')
        return done(null, false)
      }
    })
  }));

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


// import passport from "passport";
// import { Strategy, ExtractJwt } from "passport-jwt";
// import Users from './models/users';


// module.exports = (app) => {
//   const params = {
//     secretOrKey: 'secret-key',
//     jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
//   };
//   const strategy = new Strategy(params, (payload, done) => {
//     console.log(payload.id)
//     Users.findById(payload.id)
//       .then(user => {
//         if (user) {
//           return done(null, user);
//         }
//         return done(null, false);
//       })
//       .catch(error => done(error, null));
//   });
//   passport.use(strategy);
//   return {
//     initialize: () => {
//       return passport.initialize();
//     },
//     authenticate: () => {
//       return passport.authenticate("jwt", { session: true });
//     }
//   };
// };