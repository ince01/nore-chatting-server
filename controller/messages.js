import { Messages } from '../models';

exports.getListMessById = async (req, res) => {
  const currentUser = req.user;
  const idUser = req.body.id;
  let responseData = {};
  await Messages.find({ idUser: currentUser._id, idUserChatting: idUser }, (err, data) => {
    if (!err) {
      return responseData = {
        status: true,
        result: data,
        message: 'Get list messages success.'
      };
    }
    responseData = {
      status: false,
      message: err.message || 'Something went wrong.'
    };
  });
  res.json(responseData);
}