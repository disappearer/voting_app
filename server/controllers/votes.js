var db = require('../../config/sequelize');
/**
 * Create a vote
 */
exports.create = function(req, res) {
  var voteObj = req.body;
  voteObj.ip = req.ip.split(':')[3];
  voteObj.sessionId = req.session.id;

  // check if already voted from ip address
  db.Vote.findOne({
    where: {
      ip: voteObj.ip,
      PollId: voteObj.PollId
    }
  }).then(function(vote){
    if(!vote){
      // check if sessionId exists
      return db.Vote.findOne({
        where: {
          sessionId: voteObj.sessionId,
          PollId: voteObj.PollId
        }
      });
    }
    return Promise.resolve(vote);
  }).then(function(vote){
    if(!vote){
      // if no ip/sessionId, try to find UserId
      return db.Vote.findOne({
        where: {
          UserId: voteObj.UserId,
          PollId: voteObj.PollId
        }
      });
    }
    return Promise.resolve(vote);
  }).then(function(vote){
    if(!vote){
      // no ip/sessionId/UserId, create a new vote
      db.Vote.create(voteObj).then(function(vote){
        if(!vote) res.send({status: 'error', message: 'Error occurred. Vote not created'});
        // find the appropriate answer and increment vote count
        db.Answer.findOne({where: {id: voteObj.AnswerId}}).then(function(answer){
          if(!answer) res.send({status: 'error', message: 'Error occurred. Answer not found'});
          answer.increment('votes').then(function(answer){
            if(!answer) res.send({status: 'error', message: 'Error occurred. Number of votes not incremented.'});
            res.send({status: 'success', message: 'Vote noted.'})
          });
        });
      });
    } else {
      res.send({status: 'error', message: 'Already voted.'});
    }
  });
};
