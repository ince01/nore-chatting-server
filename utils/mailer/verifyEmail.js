import { verifyEmailLink } from '../helper/buildEmailLink';

const verifyEmail = (token, toEmailAdd, name) => {
  const link = verifyEmailLink(token, toEmailAdd);
  return {
    to: toEmailAdd,
    from: 'no-reply@nore-chatting-app.vn',
    templateId: 'd-9ce8127fa1824c67b9dbab099e5d29d3',
    dynamic_template_data: {
      subject: 'Please verify your e-mail for use Nore Chatiing App',
      name: name,
      link: link,
      email: toEmailAdd,
    },
  }
}

module.exports = { verifyEmail }
