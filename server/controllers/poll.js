'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find poll by id
 * Note: This is called every time that the parameter :pollId is used in a URL.
 * Its purpose is to preload the poll on the req object then call the next function.
 */
exports.poll = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Poll.find({
      where: {id: id}
    }).then(function(poll){
        if(!poll) {
            return next(new Error('Failed to load poll ' + id));
        } else {
            req.poll = poll;
            return next();
        }
    }).catch(function(err){
        return next(err);
    });
};

/**
 * Create a poll
 */
exports.create = function(req, res) {
    var pollObj = {
      question: req.body.question,
      UserId: req.body.userid
    }

    var answers = req.body.answers
    // save and return and instance of poll on the res object.
    db.Poll.create(pollObj).then(function(poll){
        if(!poll){
            return res.send('users/signup', {errors: new StandardError('Poll could not be created')});
        } else {
            Promise.all(answers.map(function(answer){
              answer.PollId = poll.id
              return db.Answer.create(answer)
            })).then(function(results){
              return res.jsonp(poll)
            })
        }
    }).catch(function(err){
        return res.send('users/signup', {
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a poll
 */
exports.update = function(req, res) {

    // create a new variable to hold the poll that was placed on the req object.
    var poll = req.poll;

    poll.updateAttributes({
        title: req.body.title,
        content: req.body.content
    }).then(function(a){
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Delete an poll
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the poll that was placed on the req object.
    var poll = req.poll;

    poll.destroy().then(function(){
        return res.jsonp(poll);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an poll
 */
exports.show = function(req, res) {
    // Sending down the poll that was just preloaded by the polls.poll function
    // and saves poll on the req object.
    return res.jsonp(req.poll);
};

/**
 * List of Polls
 */
exports.all = function(req, res) {
    db.Poll.findAll({include: [{model:db.User, attributes: ['id', 'username', 'name']}]}).then(function(polls){
        return res.jsonp(polls);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Poll authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.poll.User.id !== req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
};
