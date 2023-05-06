const { Sequelize } = require('sequelize');
const { User,Drawing,Applicant, sequelize} = require('./models');
const Op = Sequelize.Op

module.exports = async () => {
    try {
      const targets = await Drawing.findAll({
        where: {
          deposit: true,
          givenNumber: {
            [Sequelize.Op.lt]: Sequelize.col('selectNum'),
          },
        },
      });
  
        await Promise.all(
            targets.map(async (target) => {
                try {
                    const targetUser = await target.getUser();
                    console.log(targetUser);
        
                    const countMale = await Applicant.count({
                        gender: 'male',
                        school: targetUser.school,
                    });
                    const countFemale = await Applicant.count({
                        gender: 'female',
                        school: targetUser.school,
                    });
        
                    let givenNumber = target.givenNumber;
                    let limit;
                    if (target.gender == 'male') {
                        limit = countFemale;
                    } else {
                        limit = countMale;
                    }
        
                    let countLimit = 0;
                    let isFinished = false;
        
                    while (givenNumber < target.selectNum) {
                        if (countLimit > limit) {
                            isFinished = false;
                            break;
                        }
            
                        const drawedUsers = await targetUser.getDrawing();
                        const randomApplicant = await Applicant.findOne({
                            where: {
                            UserId: { [Op.ne]: targetUser.id },
                            school: targetUser.school,
                            gender: { [Op.ne]: targetUser.gender },
                            },
                            order: sequelize.literal('rand()'),
                        });
            
                        if (randomApplicant) {
                            const randomUser = await User.findOne({
                            where: { id: randomApplicant.UserId },
                            });
                            console.log(randomUser);
            
                            if (drawedUsers.find((user) => user.id === randomUser.id)) {
                                console.log('selected User');
                                countLimit++;
                                continue;
                            }
            
                            await randomUser.addDrawed(targetUser);
                            await randomUser.update({ numberOfChosen: +1 });
                            target.update({ givenNumber: target.givenNumber + 1 });
                            givenNumber++;
                        } else {
                            console.log('신청자가 없습니다.');
                            break;
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            })
        );
    
        return Promise.resolve();
    } catch (error) {
      console.error(error);
    }
  };
  