module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
			username: DataTypes.STRING,
      cookie: DataTypes.STRING,
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
