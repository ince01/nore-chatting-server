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
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          var token = jwt.sign({ id: user._id }, 'secret-key-jwt');
          return res.json({
            success: true,
            result: {
              data: user,
              sessionToken: token,
            },
            message: "Login success !"
          })
        } else {
          return res.json({
            success: false,
            result: false,
            message: "Invail email or password !"
          })
        }
      }).catch((err) => {
        throw err
      })
    }
  })
}

exports.logout = (req, res) => {

}

exports.getUsers = (req, res) => {
  Users.find({}, (err, user) => {
    if (err) {
      console.log(err);
    }
    res.json(user)
    console.log(req.session)
  });
}