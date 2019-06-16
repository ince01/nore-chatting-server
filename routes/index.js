import express from 'express';
import passport from 'passport';
import multer, { memoryStorage } from 'multer';

const router = express.Router();

const upload = multer({
  storage: memoryStorage(), limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
})


import { register, login, getCurrentUserByToken, getFriends, addFriend, verifyEmail, findPeople, acceptFriend, updateUser, getListFriendRequest } from '../controller/users';
import { uploadImage } from '../controller/upload';
import { getListMessById } from '../controller/messages';

router.route('/register')
  .post(register)

router.route('/verify/:token/verify-email')
  .get(verifyEmail)

router.route('/login')
  .post(login)

router.route('/user/me')
  .all(passport.authenticate('jwt'))
  .post(getCurrentUserByToken)

router.route('/user/update')
  .all(passport.authenticate('jwt'))
  .post(updateUser)

router.route('/user/findPeople')
  .all(passport.authenticate('jwt'))
  .post(findPeople)

router.route('/user/friendRequest')
  .all(passport.authenticate('jwt'))
  .post(getListFriendRequest)

router.route('/user/friends')
  .all(passport.authenticate('jwt'))
  .post(getFriends)

router.route('/user/addFriend')
  .all(passport.authenticate('jwt'))
  .post(addFriend)

router.route('/user/acceptFriend')
  .all(passport.authenticate('jwt'))
  .post(acceptFriend)

router.route('/upload')
  .all(upload.single('file'))
  .post(uploadImage)

router.route('/messages')
  .all(passport.authenticate('jwt'))
  .post(getListMessById)


module.exports = router;

