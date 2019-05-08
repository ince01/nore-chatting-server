import express from 'express';
import passport from 'passport';
const router = express.Router();

import { createUser, login, getUsers, getFriends, addFriend } from '../controller/users';

router.route('/register')
    .post(createUser)

router.route('/login')
    .post(login)

router.route('/user')
    .all(passport.authenticate('jwt'))
    .get(getUsers)

router.route('/user/friends')
    .all(passport.authenticate('jwt'))
    .get(getFriends)

router.route('/user/add-friend')
    .all(passport.authenticate('jwt'))
    .post(addFriend)

module.exports = router;

