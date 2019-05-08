import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users, Friends } from '../models';

exports.createUser = async (req, res) => {

  let reqBody = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10) // Hash password
  }

  await Users.create(reqBody, (err, data) => {
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
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          var token = jwt.sign({ id: user._id }, 'secret-key-jwt');
          return res.json({
            sucess: true,
            result: {
              data: user,
              sessionToken: token,
            },
            message: "Login success !"
          })
        } else {
          return res.status(400).send({
            message: 'Invail email or password'
          });
        }
      }).catch((err) => {
        throw err
      })
    } else {
      return res.status(400).send({
        message: 'Invail email or password'
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

exports.getFriends = (req, res) => {

  Friends.find({ idUser: req.user._id })
    .populate('idFriend')
    .exec((err, friend) => {
      let responseData = {};
      responseData = {
        status: 'T',
        result: friend,
        // message: 'Add friend success !'
      };
      if (err) {
        responseData = {
          status: 'F',
          code: err,
          result: [],
          message: err.message
        };
      }
      res.json(responseData);
    });
}

exports.addFriend = (req, res) => {

  Friends.create(req.body, (err, data) => {
    let responseData = {};
    responseData = {
      status: 'T',
      result: data,
      message: 'Add friend success !'
    };
    if (err) {
      responseData = {
        status: 'F',
        code: err,
        result: [],
        message: err.message || 'Add friend FAIL !'
      };
    }
    res.json(responseData);
  })
}