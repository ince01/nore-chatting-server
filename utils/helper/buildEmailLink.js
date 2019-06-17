import { PORT } from '../../config';

exports.verifyEmailLink = (token, email) => {
  if (process.env.NODE_ENV = 'production') {
    return `https://nore-chatting-server.herokuapp.com/verify/${token}/verify-email?email=${email}`;
  } else {
    return `http://localhost:${PORT}/verify/${token}/verify-email?email=${email}`;
  }
}