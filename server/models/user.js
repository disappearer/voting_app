module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
			twitterUserId: DataTypes.STRING
		},
		{
			associate: function(models){
				User.hasMany(models.Poll)
        User.hasMany(models.Vote)
			}
		}
	);

	return User
}
