import Users from '../models/users';

exports.createUser = async (req, res) => {

  await Users.create(req.body, async (err, data) => {
    let responseData = {};

    responseData = {
      status: 'T',
      result: data,
      message: 'Get list certifications successfully.'
    };
    if (err) {
      responseData = {
        status: 'F',
        code: err,
        result: [],
        message: err.message || 'Get list certifications with some problems.'
      };
    }

    res.json(responseData);
  })
};
