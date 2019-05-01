import { Schema, model, SchemaTypes } from 'mongoose';

var messageSchema = new Schema({
  from: {
    type: SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  to: {
    type: SchemaTypes.ObjectId,
    ref: 'Users',
    required: true,
  },
  contents: {
    type: String,
    required: true,
  }
}, {
    timestamps: true,
  });

var Messages = model('Messages', messageSchema);

module.exports = Messages;