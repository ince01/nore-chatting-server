import { PORT } from '../../config';

exports.verifyEmailLink = (token, email) => {
  const link = `http://localhost:${PORT}/verify/${token}/verify-email?email=${email}`;
  return link;
}