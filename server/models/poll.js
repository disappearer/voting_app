module.exports = function(sequelize, DataTypes) {

	var Poll = sequelize.define('Poll', {
			question: DataTypes.STRING
		},
		{
			associate: function(models){
				Poll.belongsTo(models.User)
        Poll.hasMany(models.Vote)
			}
		}
	);

	return Poll
}
