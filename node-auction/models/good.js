const Sequelize = require('sequelize');

module.exports = class Good extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            timelimit: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            sold: {
                type: Sequelize.BOOLEAN,
                allowNullNull: false,
                defaultValue: false,
            },
            paid: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            timeover: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Good',
            tableName: 'goods',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Good.belongsTo(db.User, {as:'Owner'});
        db.Good.belongsTo(db.User, {as: 'Sold'});
        db.Good.hasMany(db.Auction);
    }
}