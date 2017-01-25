

exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * Logout
 */
exports.signout = function (req, res) {
    console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.twitterUserName + '}');
    req.logout();
    return res.send({status: 'success', message: 'User logout successfully.'});
};
