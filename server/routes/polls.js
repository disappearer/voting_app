var polls  = require('../controllers/polls');
var express = require('express');
var router  = express.Router();

router.route('/')
  .get(polls.all)
  .post(polls.create)
router.route('/:pollId')
  .get(polls.show)
  .put(polls.update)
  .delete(polls.destroy)

router.param('pollId', polls.poll)

module.exports = router;
