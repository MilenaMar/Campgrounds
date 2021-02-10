const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users')

router.route('/signup')
  .get(users.signUpForm )
  .post(catchAsync(users.signUp))

router.route('/login')
   .get( users.loginForm)
   .post(passport.authenticate
         ('local', {failureFlash:true, 
          failureRedirect:'/login'}), users.login)


router.get('/logout',isLoggedIn, users.logout)

module.exports = router;