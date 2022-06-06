const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport')


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        //store the hashed password and salt in the new user
        //passport is ensuring that every username is unique
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo: true
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    //returning client to the desired destination after logging in, or if none, go to /campgrounds
    //returnTo located in middleware.js file
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //reto stay in the seturnTo is only used once.. it's unecessary for it ssion
    delete req.session.returnTo
    //return to retunTo after logging in, or back to campground if there was no destination recorded
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
})

module.exports = router;