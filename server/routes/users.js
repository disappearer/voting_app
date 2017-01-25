var express = require('express');
var router  = express.Router();
var passport = require('passport')
var users = require('../controllers/users')

router.get('/login/twitter', passport.authenticate('twitter'))
  .get('/auth/twitter/callback',
    passport.authenticate('twitter', {failureRedirect: '/login/twitter'}),
    function(req, res){
      res.redirect('/polls')
    }
  )
  .get('/signout', users.signout);

module.exports = router;
