const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users')

router.route('/singup')
  .get(users.singUpForm )
  .post(catchAsync(users.singUp))

router.route('/login')
   .get( users.loginForm)
   .post(passport.authenticate
         ('local', {failureFlash:true, 
          failureRedirect:'/login'}), users.login)


router.get('/logout',isLoggedIn, users.logout)

module.exports = router;