import mongoose from 'mongoose';

module.exports = (app) => {
  const dbUri = 'mongodb://admin:F7WU2t8dSktzqen@ds121026.mlab.com:21026/nore-chatting-app';
  const options = {
    useNewUrlParser: true,
  }
  mongoose.connect(dbUri, options, (error) => {
    console.log(`Can't connect database! (Message: ${error.message}`)
  });
}