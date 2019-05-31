import { Schema, model, SchemaTypes } from 'mongoose';
import { Users } from './index';

var friendRelationshipSchema = new Schema({
  from: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  to: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  }
},
  {
    timestamps: true,
  })

// friendRelationshipSchema.post('save', function (doc, next) {
//   Users.updateOne({ _id: doc.from }, { $push: { friendRequests: doc._id } }, (err) => {
//     if (err)
//       next(err);
//   });
//   Users.updateOne({ _id: doc.to }, { $push: { friendRequests: doc._id } }, (err) => {
//     if (err)
//       next(err);
//   });
//   next();
// })

friendRelationshipSchema.post('updateOne', function (doc, next) {
  const { from, to } = this._conditions;
  Users.updateOne({ _id: from }, { $push: { friends: to } }, (err) => {
    if (err)
      next(err);
  });
  Users.updateOne({ _id: to }, { $push: { friends: from } }, (err) => {
    if (err)
      next(err);
  });
  next();
})

var FriendRelationships = model('Friend-requests', friendRelationshipSchema)

module.exports = FriendRelationships