const Sequelize = require('sequelize');

module.exports = class Drawing extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            selectNum: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            deposit: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            givenNumber: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            }
        }, {
            sequelize,
            modelName: 'drawing',
            tableName: 'drawings',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Drawing.belongsTo(db.User);
    }

};