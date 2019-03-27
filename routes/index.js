import express from 'express';
const router = express.Router();

import { createUser, auth } from '../controller/users';

router.route('/user/create')
    .post(createUser)

router.route('/login')
    .get()
    .post(auth)

module.exports = router;

