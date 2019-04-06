import bcrypt from 'bcrypt';
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

exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  Users.findOne({ email }, (err, user) => {
    if (err) {
      throw err
    }
    if (user) {
      bcrypt.compare(password, user.password,
        (err, isMatch) => {
          if (err) {
            console.log(err);
          }
          if (isMatch) {
            console.log(user)
            var token = jwt.sign({ id: user._id }, 'secret-key');
            console.log({ token: token });
            res.json({
              success: true,
              token: token,
              data: user
            })
          } else {
            res.json({ success: false })
          }
        });
    }
  })
}

exports.getUsers = (req, res) => {
  Users.find({}, (err, user) => {
    if (err) {
      console.log(err);
    }
    res.json(user)
  });
}