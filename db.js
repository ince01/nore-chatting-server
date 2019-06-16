import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

module.exports = () => {
  const options = {
    useNewUrlParser: true,
  }
  mongoose.connect(MONGODB_URI, options, (error) => {
    if (error) {
      console.log(`Can't connect database! (Reassion: ${error.message})`);
    }
    if (!error) {
      console.log(`Connected database ...`);
    }
  });
  mongoose.set('useCreateIndex', true);
}