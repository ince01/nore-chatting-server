import { Schema, model } from 'mongoose';

var imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
}, {
    timestamps: true,
  });

var Images = model('Images', imageSchema);

module.exports = Images;