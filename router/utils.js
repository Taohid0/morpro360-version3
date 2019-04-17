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

    if (fromPickUpDate) {
        const date = new Date(fromPickUpDate);
        console.log(date);
        conditionObject.pickUpDate = { [Op.gte]: date };
    }
    if (toPickUpDate) {
        const date = new Date(toPickUpDate);
        console.log(date);
        conditionObject.pickUpDate = { [Op.lte]: date };
    }

    if (fromDropOffDate) {
        const date = new Date(fromDropOffDate);
        console.log(date);
        conditionObject.dropOffDate = { [Op.gte]: date };
    }
    if (toDropOffDate) {
        const date = new Date(toDropOffDate);
        console.log(date);
        conditionObject.dropOffDate = { [Op.lte]: date };
    }

    if (minWeight !== undefined) {
        conditionObject.weight = { [Op.gte]: minWeight };
    }

    if (maxWeight !== undefined) {
        conditionObject.weight = { [Op.lte]: maxWeight };
    }

    if (minRate !== undefined) {
        conditionObject.rate = { [Op.gte]: minRate };
    }

    if (maxRate !== undefined) {
        conditionObject.rate = { [Op.lte]: maxRate };
    }

    if (productDetails != undefined && productDetails.length) {
        conditionObject.productDetails = { [Op.like]: "%" + productDetails + "%" };
    }

    if (pickUpCity != undefined && pickUpCity.length) {
        conditionObject.pickUpCity = { [Op.like]: "%" + pickUpCity + "%" };
    }

    if (pickUpZipCode != undefined && pickUpZipCode.length) {
        conditionObject.pickUpZipCode = { [Op.like]: "%" + pickUpZipCode + "%" };
    }

    if (pickUpState != undefined && pickUpState.length) {
        conditionObject.pickUpState = { [Op.like]: "%" + pickUpState + "%" };
    }

    if (dropOffCity != undefined && dropOffCity.length) {
        conditionObject.dropOffCity = { [Op.like]: "%" + dropOffCity + "%" };
    }
    
    if (dropOffZipCode != undefined && dropOffZipCode.length) {
        conditionObject.dropOffZipCode = { [Op.like]: "%" + dropOffZipCode + "%" };
    }

    if (dropOffState != undefined && dropOffState.length) {
        conditionObject.dropOffState = { [Op.like]: "%" + dropOffState + "%" };
    }

    return conditionObject;

}

module.exports = {
    configureConditionObject,
}

