var express = require('express');
var router  = express.Router();
var passport = require('passport')
var users = require('../controllers/users')

router
  .get('/login', passport.authenticate('twitter'))

  .get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login',
    }))

  .get('/loggedin', users.isLoggedIn)

  .get('/signout', users.signout);

module.exports = router;
