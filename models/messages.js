import { Schema, model, SchemaTypes } from 'mongoose';

var messageSchema = new Schema({
  idUser: {
    type: SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  idUserChatting: {
    type: SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, {
    timestamps: true,
  });

var Messages = model('Messages', messageSchema);

module.exports = Messages;