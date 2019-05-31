import express from 'express';
import passport from 'passport';
const router = express.Router();

import { register, login, getCurrentUserByToken, getFriends, addFriend, verifyEmail, findPeople, acceptFriend } from '../controller/users';

router.route('/register')
    .post(register)

router.route('/verify/:token/verify-email')
    .get(verifyEmail)

router.route('/login')
    .post(login)

router.route('/user/me')
    .all(passport.authenticate('jwt'))
    .post(getCurrentUserByToken)

router.route('/user/findPeople')
    .all(passport.authenticate('jwt'))
    .post(findPeople)

router.route('/user/friends')
    .all(passport.authenticate('jwt'))
    .post(getFriends)

router.route('/user/addFriend')
    .all(passport.authenticate('jwt'))
    .post(addFriend)

router.route('/user/acceptFriend')
    .all(passport.authenticate('jwt'))
    .post(acceptFriend)

module.exports = router;

