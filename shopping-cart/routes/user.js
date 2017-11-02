var express        = require('express');
var router         = express.Router();
var passport       = require('passport');
var csrf           = require('csurf');
var Footballplayer = require('../models/footballplayer');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLogin, function(req, res, next){
  res.render('user/profile');
});

router.get('/logout',isLogin, function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.use('/', notLogin, function(req, res, next){
    next();
});
//Sign Up
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


// Sign In
router.get('/signin', function(req, res, next){
   var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

function isLogin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLogin(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}