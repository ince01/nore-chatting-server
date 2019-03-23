import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    genre: String,
    password: String,
}, {
    timestamps: true
});

var User = mongoose.model('User', userSchema);

module.exports = User;