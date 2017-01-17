module.exports = function(sequelize, DataTypes) {

	var Vote = sequelize.define('Vote', {
			ip: DataTypes.STRING,
      cookie: DataTypes.STRING,
		},
		{
			associate: function(models){
				Vote.belongsTo(models.Poll)
        Vote.belongsTo(models.Answer)
        Vote.belongsTo(models.User)
			}
		}
	);

	return Vote
}
