const Sequelize = require("sequelize");

function configureConditionObject(ctx, conditionObject) {
    const Op = Sequelize.Op;
    const { name, minDistance, maxDistance, fromPickUpDate, toPickUpDate,
        fromDropOffDate, toDropOffDate, minWeight, maxWeight, minRate,
        maxRate, productDetails, pickUpCity, pickUpZipCode, pickUpState,
        dropOffCity, dropOffZipCode, dropOffState } = ctx.request.body;

    if (name != undefined && name.length) {
        // conditionObject.name = (Sequelize.fn("lower",Sequelize.col("name")),  {[Op.like]: "%" + name + "%" });
        conditionObject.name = { [Op.like]: "%" + name + "%" };
    }

    if (minDistance !== undefined) {
        conditionObject.distance = { [Op.gte]: minDistance };
    }
    if (maxDistance !== undefined) {
        conditionObject.distance = { [Op.lte]: maxDistance };
    }

    if (fromPickUpDate !== undefined) {
        const date = new Date(fromPickUpDate);
        console.log(date);
        conditionObject.pickUpDate = { [Op.gte]: date };
    }

    return conditionObject;

}

module.exports = {
    configureConditionObject,
}

