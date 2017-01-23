module.exports = function(sequelize, DataTypes) {

	var Answer = sequelize.define('Answer', {
			text: DataTypes.STRING,
      votes: DataTypes.INTEGER
		},
		{
			associate: function(models){
				Answer.belongsTo(models.Poll, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
			}
		}
	);

	return Answer
}
