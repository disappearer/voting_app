var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var _ = require('lodash')
var db = {}

var user = process.env.MYSQL_USER;
var password = process.env.MYSQL_PASSWORD;
var host = process.env.MYSQL_HOST;
var database = process.env.MYSQL_DB;

var sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

// get models from files in models directory
var models_dir = path.join(__dirname, '../server/models')
fs.readdirSync(models_dir)
  .forEach(function(file){
    var model = sequelize.import(path.join(models_dir,file))
    db[model.name] = model
  })

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db)
    }
})

// create tables if they don't exist
sequelize.sync()

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
