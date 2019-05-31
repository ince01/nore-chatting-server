import { Schema, model, SchemaTypes, SchemaType } from 'mongoose';
import { Friends } from './index';
import bcrypt from 'bcrypt';

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: SchemaTypes.ObjectId,
    ref: 'Images',
  },
  avatarUrl: {
    type: String,
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
    required: true,
  },
  friends: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'Users',
    }
  ]
}, {
    timestamps: true
  });

userSchema.pre('save', async function (next) {
  var hash = await bcrypt.hashSync(this.password, 10);
  this.password = hash;
  next();
});

// userSchema.post('save', function (doc, next) {
//   console.log("doc._id", doc._id)
//   Friends.create({ idUser: doc._id, idFriend: doc._id }, (data, err) => {
//     if (err) {
//       return console.log(err);
//     } else {
//       console.log("data", data)
//     }
//   });
//   next();
// })

var Users = model('Users', userSchema);

module.exports = Users;