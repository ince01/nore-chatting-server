import express from 'express';
const router = express.Router();

import { createUser, auth, getUsers } from '../controller/users';

router.route('/user/create')
    .post(createUser)

router.route('/login')
    .get()
    .post(auth)

router.route('/user')
    .get(getUsers)

module.exports = router;

