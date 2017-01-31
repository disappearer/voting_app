
/**
 * Create a vote
 */
exports.create = function(req, res) {
  var voteObj = req.body;
  voteObj.ip = req.ip.split(':')[3];
  console.log(req.cookies.connect.sid)
  // save and return and instance of vote on the res object.
  db.Vote.create(voteObj).then(function(vote){
      if(!vote){
          return res.send('users/signup', {errors: new StandardError('Vote could not be created')});
      } else {
          // when vote is created, create vote answers
          Promise.all(answers.map(function(answer){
            answer.VoteId = vote.id
            return db.Answer.create(answer)
          })).then(function(results){
            return res.jsonp(vote)
          })
      }
  }).catch(function(err){
      return res.send('users/signup', {
          errors: err,
          status: 500
      });
  });
};
