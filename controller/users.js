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

// exports.login = passport.authenticate('local');


