import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Users from '../models/users';

exports.createUser = async (req, res) => {

  let reqBody = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10) // Hash password
  }

  await Users.create(reqBody, async (err, data) => {
    let responseData = {};
    responseData = {
      status: 'T',
      result: data,
      message: 'Create user success !'
    };
    if (err) {
      responseData = {
        status: 'F',
        code: err,
        result: [],
        message: err.message || 'Create user FAIL !'
      };
    }
    res.json(responseData);
  })
}

exports.auth = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });

  })(req, res, next);
}

exports.getUsers = (req, res) => {
  Users.find({}, (err, user) => {
    if (err) {
      console.log(err);
    }
    res.json(user)
  });
}