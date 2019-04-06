import express from 'express';
import passport from 'passport';
const router = express.Router();

import { createUser, login, getUsers } from '../controller/users';

router.route('/user/create')
    .post(createUser)

router.route('/login')
    .get()
    .post(login)

router.route('/user')
    .all(passport.authenticate('jwt'))
    .get(getUsers)

module.exports = router;

