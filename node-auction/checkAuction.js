const { Good, Auction, User, sequelize} = require('./models');

module.exports = async() => {
    try {
        const targets = await Good.findAll({
            where: {
                SoldId: null,
                sold: true,
            },
        });
        targets.forEach(async(target) => {
            const timelimit = new Date(target.createdAt);
            timelimit.setMinutes(timelimit.getMinutes() + parseInt(target.timelimit,10));
            if( new Date() > timelimit){
                try{
                const success = await Auction.findOne({
                    where: {GoodId: target.id},
                    order: [['bid', 'DESC']],
                });
                await Good.update(
                    {SoldId: success && success.UserId },
                    {where: {id: target.id}}
                );
                await User.update(
                    {money: sequelize.literal(`money - ${success && success.bid}`)},
                    {where: {id: success && success.UserId }}
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