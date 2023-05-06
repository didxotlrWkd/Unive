const Sequelize = require('sequelize');

module.exports = class Applicant extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            mbti: {
                type:Sequelize.STRING(10),
                allowNull: true,
            },

            kakaoId: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            school: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            gender: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'applicant',
            tableName: 'applicants',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Applicant.belongsTo(db.User);
    }
};