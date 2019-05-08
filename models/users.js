import { Schema, model } from 'mongoose';
// import bcrypt from 'bcrypt';

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
    required: true,
  }
}, {
    timestamps: true
  });

// userSchema.pre('save', (next) => {
//   const user = this;
//   console.log(user.password)
//   bcrypt.hashSync(user.password, 10, (err, hash) => {
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   })
// });

var Users = model('Users', userSchema);

module.exports = Users;