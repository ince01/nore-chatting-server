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
  birthday: {
    type: SchemaTypes.Date,
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

var Users = model('Users', userSchema);

module.exports = Users;