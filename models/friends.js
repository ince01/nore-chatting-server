import { Schema, model, SchemaTypes } from 'mongoose';

var messageSchema = new Schema({
  idUser: {
    type: SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  idFriend: {
    type: SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  }
}, {
    timestamps: true,
  });

var Friends = model('Friends', messageSchema);

module.exports = Friends;