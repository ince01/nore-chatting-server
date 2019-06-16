import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users, Friends, FriendRelationships } from '../models';
import { sendMailToVerify } from '../utils/mailer';
import { JWT_SECRET } from '../config';
import Joi from '@hapi/joi';
import _ from 'lodash';

exports.register = async (req, res) => {
  const params = req.body;
  const schema = Joi.object().keys({
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    birthday: Joi.date().iso().required(),
    gender: Joi.string().required(),
    avatarUrl: Joi.string().optional()
  })
  const result = Joi.validate(params, schema);
  if (!_.isEmpty(result.error)) {
    throw result.error;
  }
  try {
    let responseData = {};
    Users.create(result.value, (err, data) => {
      if (!err) {
        var token = jwt.sign({ id: data._id }, JWT_SECRET);
        sendMailToVerify(token, data.email, data.fullName);
        responseData = {
          status: true,
          result: data,
          message: 'Registed.'
        };
      }
    });
    res.status(200).json(responseData);
  } catch (error) {
    throw error;
  }
};

exports.verifyEmail = (req, res) => {
  const token = req.params.token;
  const email = req.query.email;

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

  try {
    Users.findOne({ email }, (err, user) => {
      if (err) {
        throw err
      }
      if (user) {
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            var token = jwt.sign({ id: user._id }, JWT_SECRET);

            return res.status(200).json({
              sucess: true,
              result: user,
              sessionToken: token,
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
  catch (err) {
    throw err
  }
}

exports.getCurrentUserByToken = async (req, res) => {
  const currentUser = req.user;
  try {
    currentUser.friends = await Users.find({
      '_id': {
        $in: currentUser.friends
      }
    }, '_id email fullName gender avatarUrl isOnline');
    res.status(200).json(
      {
        status: true,
        result: currentUser,
        message: 'Get current user success.',
      }
    )
  } catch (err) {
    throw err
  }
}

exports.getFriends = (req, res) => {
  Friends.find({ idUser: req.user._id })
    .populate('idFriend')
    .exec((err, friend) => {
      let responseData = {};

      if (err) {
        responseData = {
          status: false,
          code: err,
          result: [],
          message: err.message
        };
        return res.status(400).json(responseData);
      }
      if (friend) {
        responseData = {
          status: true,
          result: friend,
          message: 'Get friends success.'
        };
        return res.status(200).json(responseData);
      }
    });
}

exports.addFriend = async (req, res) => {
  const currentUser = req.user;
  let responseData = {};
  try {
    const to = _.get(req.body, 'to');
    const params = { from: currentUser._id, to }
    const data = await FriendRelationships.create(params);
    responseData = {
      status: true,
      result: data,
      message: 'Add friend SUCCESS.'
    }
  } catch (err) {
    responseData = {
      status: false,
      code: err.code,
      message: err.message || 'Add friend FAILURE.'
    }
  }
  res.json(responseData);
}

exports.acceptFriend = async (req, res) => {
  const currentUser = req.user;
  let responseData = {};
  try {
    const friendRequestId = _.get(req.body, 'friendRequestId');
    const data = await FriendRelationships.updateOne({ from: friendRequestId, to: currentUser._id }, { accepted: true });
    responseData = {
      status: true,
      result: data,
      message: 'Add friend SUCCESS.'
    }
  } catch (err) {
    responseData = {
      status: false,
      code: err.code,
      message: err.message || 'Add friend FAILURE.'
    }
  }
  res.json(responseData);
}

exports.findPeople = async (req, res) => {
  const currentUser = req.user;
  const email = req.body.email.trim();
  const query = new RegExp(email, 'i');
  let responseData = {};

  try {
    const people = await Users.find({ email: query }, 'fullName email _id', async (err, data) => {
      if (!err) {
        return data;
      }
      console.log(err);
      return [];
    });
    for (var i in people) {
      const relationshipStatus = await FriendRelationships.findOne({ from: people[i]._id, to: currentUser._id }, 'from to accepted', (err, data) => {
        if (!err) {
          return data;
        }
        console.log(err);
        return null;
      });
      if (!relationshipStatus) {
        relationshipStatus = await FriendRelationships.findOne({ from: currentUser._id, to: people[i]._id }, 'from to accepted', (err, data) => {
          if (!err) {
            return data;
          }
          console.log(err);
          return null;
        })
      }
      people[i] = _.assign({}, people[i]._doc, { relationshipStatus });
    };
    responseData = {
      status: true,
      result: people,
      message: 'Fiend people SUCCESS.'
    }
  } catch (err) {
    responseData = {
      status: false,
      code: err.code,
      message: err.message || 'Fiend people FAILURE.'
    }
  }
  res.json(responseData);
}
