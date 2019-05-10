import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users, Friends } from '../models';
import { sendMailToVerify } from '../utils/mailer';
import { JWT_SECRET } from '../config';

exports.createUser = async (req, res) => {

  let reqBody = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10) // Hash password
  }

  await Users.create(reqBody, (err, data) => {
    let responseData = {};

    if (data) {
      var token = jwt.sign({ id: data._id }, JWT_SECRET);
      sendMailToVerify(token, data.email, data.fullName);

      responseData = {
        status: 'T',
        result: data,
        message: 'Create user success !'
      };
    }

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

exports.verifyEmail = (req, res) => {
  const token = req.params.token;
  const email = req.query.email;
  console.log(email)

  if (token && email) {

    Users.findOne({ email }, (err, user) => {
      if (err) {
        return res.send(err.message);
      }

      if (user && user.emailVerified) {
        return res.send('Email Already Verified');
      }

      if (user && !user.emailVerified) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
          if (err) {
            return res.send(err.message);
          }

          Users.findByIdAndUpdate(decoded.id, { emailVerified: true }, (err) => {
            if (err) {
              return res.send(err.message);
            };
            return res.send('Email is verified');
          });

        });
      }

      if (!user) {
        return res.send('Invail email!');
      }
    });
  } else {
    res.send('something went wrong!');
  }

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
          var token = jwt.sign({ id: user._id }, JWT_SECRET);
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