import sgMail from '@sendgrid/mail';
import { verifyEmail } from './verifyEmail';

//config sendgrid mailer
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMailToVerify = (token, toEmailAdd, name) => {
  sgMail.send(verifyEmail(token, toEmailAdd, name));
}

// const sendMailToResetPass = (toEmailAdd) => {
//   sgMail.send(verifyEmail(toEmailAdd), (err, result) => {
//     if (err) {
//       throw err;
//     }
//     else {
//       //Celebrate
//       //console.log(result);
//     }
//   });
// }
module.exports = { sendMailToVerify }
