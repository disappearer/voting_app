module.exports = function(sequelize, DataTypes) {

	var Poll = sequelize.define('Poll', {
			question: DataTypes.STRING
		},
		{
			associate: function(models){
				Poll.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
        Poll.hasMany(models.Answer)
			}
		}
	);

	return Poll
}
