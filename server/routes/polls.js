var polls  = require('../controllers/polls');
var express = require('express');
var router  = express.Router();
var users = require('../controllers/users')

router.route('/')
  .get(polls.all)
  .post(users.requiresLogin,polls.create)
router.route('/:pollId')
  .get(polls.show)
  .put(users.requiresLogin, polls.hasAuthorization, polls.update)
  .delete(users.requiresLogin, polls.hasAuthorization, polls.destroy)

router.param('pollId', polls.poll)

module.exports = router;
