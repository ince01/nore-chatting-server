import express from 'express';

import {createUser} from '../controller/users';

const router = express.Router();

router.route('/user/create')
    .post(createUser)

module.exports = router;

