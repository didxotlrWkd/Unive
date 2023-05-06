const Sequelize = require('sequelize');
const User  = require('./user');
const Applicant = require('./applicant');
const Drawing = require('./drawing');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username,  config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Applicant = Applicant;
db.Drawing = Drawing;

User.init(sequelize);
Applicant.init(sequelize);
Drawing.init(sequelize);

User.associate(db);
Applicant.associate(db);
Drawing.associate(db);


module.exports = db;
