var express = require('express');
var router  = express.Router();
var passport = require('passport')
var users = require('../controllers/users')

router
  .get('/login', passport.authenticate('twitter'))

  .get('/login/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      // add the user object to the $scope via login popup
      req.session.save(() => {
        res.redirect('/setuser');
      });
    }
  )

  .get('/loggedin', users.isLoggedIn)

  .get('/signout', users.signout)

  .get('/setuser', function(req, res){
    // add the user object to the $scope via login popup
    res.locals.user = req.isAuthenticated() ? req.user : null;
    res.render('auth');
  });

module.exports = router;
