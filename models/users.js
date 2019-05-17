import { Schema, model, SchemaTypes } from 'mongoose';
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
  friends: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'Users',
    }
  ],
  avatar: {
    type: SchemaTypes.ObjectId,
    ref: 'Images',
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