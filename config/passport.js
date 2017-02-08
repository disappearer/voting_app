var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;
var db = require('./sequelize')

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK
  },
  function(token, tokenSecret, profile, cb) {
    db.User.findOrCreate({
      where: {
          twitterUserId: profile.id,
          twitterUserName: profile.username,
          twitterName: profile.displayName
        }
      }).then(function (user) {
        return cb(null, user);
    }).catch(function(err){
      cb(err, null, err)
    });
  }
));

passport.serializeUser(function(user,cb){
  cb(null, user[0].id)
})

passport.deserializeUser(function(id, done) {
    db.User.find({where: {id: id}}).then(function(user){
        if(!user){
            return done(null, false);
        }
        done(null, user);
    }).catch(function(err){
        done(err, null);
    });
});

module.exports = passport;
