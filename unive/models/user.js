const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({  
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },

            school: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },

            department: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            studentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            gender: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            numberOfChosen: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

   static associate(db) {
        db.User.hasOne(db.Applicant);
        db.User.hasMany(db.Drawing);
        db.User.belongsToMany(db.User, {
            foreignKey: 'drawingId',
            as: 'Drawing',
            through: 'Draw',
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'drawedId',
            as: 'Drawed',
            through: 'Draw',
        });
   }
};