module.exports = function(sequelize, DataTypes) {

	var Answer = sequelize.define('Answer', {
			answer: DataTypes.STRING,
      votes: DataTypes.INTEGER
		},
		{
			associate: function(models){
				Answer.belongsTo(models.Poll)
        Answer.hasMany(models.Vote)
			}
		}
	);

	return Answer
}
