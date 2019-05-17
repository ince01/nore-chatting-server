import express from 'express';
import passport from 'passport';
const router = express.Router();

import { register, login, getCurrentUserByToken, getFriends, addFriend, verifyEmail } from '../controller/users';

router.route('/register')
    .post(register)

router.route('/verify/:token/verify-email')
    .get(verifyEmail)

router.route('/login')
    .post(login)

router.route('/user/getCurrentUserByToken')
    .all(passport.authenticate('jwt'))
    .post(getCurrentUserByToken)

router.route('/user/friends')
    .all(passport.authenticate('jwt'))
    .post(getFriends)

router.route('/user/add-friend')
    .all(passport.authenticate('jwt'))
    .post(addFriend)

module.exports = router;

