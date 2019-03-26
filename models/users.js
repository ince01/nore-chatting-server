import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
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

var Users = mongoose.model('Users', userSchema);

module.exports = Users;