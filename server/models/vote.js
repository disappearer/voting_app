module.exports = function(sequelize, DataTypes) {

	var Vote = sequelize.define('Vote', {
			ip: DataTypes.STRING,
      sessionId: DataTypes.STRING,
		},
		{
			associate: function(models){
				Vote.belongsTo(models.Poll, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        })
        Vote.belongsTo(models.Answer, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        })
        Vote.belongsTo(models.User)
			}
		}
	);

	return Vote
}
