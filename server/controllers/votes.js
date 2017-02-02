var db = require('../../config/sequelize');
/**
 * Create a vote
 */
exports.create = function(req, res) {
  var voteObj = req.body.voteObj;
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
      var promise;
      if(req.body.custom){
        // if custom option, create it
        promise = db.Answer.create({
          text: voteObj.AnswerId,
          PollId: voteObj.PollId,
          votes: 1
        })
      } else {
        // if not custom option, just find the existing one
        promise = db.Answer.findOne({where: {id: voteObj.AnswerId}});
      }
      promise.then(function(answer){
        // if custom option, take the new answer id
        if(req.body.custom) voteObj.AnswerId = answer.id;

        db.Vote.create(voteObj).then(function(vote){
          if(!vote) {
            res.send({status: 'error', message: 'Error occurred. Vote not created'});
          } else {
            // increment vote count if not custom option
            if(!req.body.custom){
              answer.increment('votes').then(function(answer){
                if(!answer) res.send({status: 'error', message: 'Error occurred. Number of votes not incremented.'});
                else res.send({status: 'success', message: 'Vote noted.'});
              });
            } else {
              res.send({status: 'success', message: 'Vote noted.'});
            }
          }
        });
      })

    } else {
      res.send({status: 'error', message: 'Already voted.'});
    }
  });
};
