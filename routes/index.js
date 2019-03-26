import express from 'express';
const router = express.Router();

import { createUser } from '../controller/users';

router.route('/user/create')
    .post(createUser)

// router.route('/login')
//     .post(login)

module.exports = router;

