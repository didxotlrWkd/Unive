const { Good,sequelize} = require('./models');

module.exports = async() => {
    try {
        const targets = await Good.findAll({
            where: {
               timeover: false,
            },
        });
        targets.forEach(async(target) => {
            const timelimit = new Date(target.createdAt);
            timelimit.setMinutes(timelimit.getMinutes() + parseInt(target.timelimit,10));
            if( new Date() > timelimit){
                try{
                await Good.update(
                    {timeover: true},
                    {where: {id: target.id}}
                );
                } catch(error) {
                    console.log(error);
                }
            }
        });
    } catch(error) {
        console.error(error);
    }
}