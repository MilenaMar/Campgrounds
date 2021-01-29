const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');

router.get('/singup', (req, res) => {
    res.render('users/singup')
})

router.post('/singup', catchAsync(async(req, res) => {
    try {
    const { email, username, password} = req.body
    const user = await new User({email, username});
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
        if(err){
            return next(err)
        }
        req.flash('success', 'Welcome to Compgrounds!');
        res.redirect('/campgrounds')
    })
    } catch (e){
        req.flash('error', e.message)
        res.redirect('/singup')
    }  
}))

router.get('/login',  (req, res)=> {
    res.render('users/login')
})

router.post('/login',passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), (req, res)=> {
req.flash('success', "Welcome Back");
 const redirectUrl = req.session.returnTo || '/campgrounds';
 delete req.session.returnTo;
res.redirect(redirectUrl);
})

router.get('/logout',isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success', "See you soon");
    res.redirect('/campgrounds');
})

module.exports = router;