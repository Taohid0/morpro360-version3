const Sequelize = require("sequelize");

function configureConditionObject(ctx, conditionObject) {
    const Op = Sequelize.Op;
    const { name, minDistance, maxDistance, fromPickUpDate, toPickUpDate,
        fromDropOffDate, toDropOffDate, minWeight, maxWeight, minRate,
        maxRate, productDetails, pickUpCity, pickUpZipCode, pickUpState,
        dropOffCity, dropOffZipCode, dropOffState } = ctx.request.body;


    console.log(name);

    if (name != undefined && name.length) {
        // conditionObject.name = (Sequelize.fn("lower",Sequelize.col("name")),  {[Op.like]: "%" + name + "%" });
        conditionObject.name = { [Op.like]: "%" + name + "%" };
    }

    if (minDistance !== undefined && minDistance.length && maxDistance !== undefined && maxDistance.length) {
        conditionObject.distance = { [Op.between]: [minDistance, maxDistance] };
    }
    else if (minDistance !== undefined && minDistance.length) {
        conditionObject.distance = { [Op.gte]: minDistance };
    }
    else if (maxDistance !== undefined && maxDistance.length) {
        conditionObject.distance = { [Op.lte]: maxDistance };
    }

    if (fromPickUpDate && toPickUpDate) {
        const fromDate = new Date(fromPickUpDate);
        const toDate = new Date(toPickUpDate);
        conditionObject.pickUpDate = { [Op.between]: [fromDate, toDate] };
    }

    else if (fromPickUpDate) {
        const date = new Date(fromPickUpDate);
        conditionObject.pickUpDate = { [Op.gte]: date };
    }
    else if (toPickUpDate) {
        const date = new Date(toPickUpDate);
        conditionObject.pickUpDate = { [Op.lte]: date };
    }

    if (fromDropOffDate && toDropOffDate) {
        const fromDate = new Date(fromDropOffDate);
        const toDate = new Date(toDropOffDate);
        conditionObject.dropOffDate = { [Op.between]: [fromDate, toDate] };
    }
    else if (fromDropOffDate) {
        const date = new Date(fromDropOffDate);
        conditionObject.dropOffDate = { [Op.gte]: date };
    }
    else if (toDropOffDate) {
        const date = new Date(toDropOffDate);
        conditionObject.dropOffDate = { [Op.lte]: date };
    }

    if (minWeight !== undefined && minWeight.length && maxWeight !== undefined && maxWeight.length) {
        conditionObject.weight = { [Op.between]: [minWeight, maxWeight] };
    }

    else if (minWeight !== undefined && minWeight.length) {
        conditionObject.weight = { [Op.gte]: minWeight };
    }

    else if (maxWeight !== undefined && maxWeight.length) {
        conditionObject.weight = { [Op.lte]: maxWeight };
    }

    if (minRate !== undefined && minRate.length && maxRate !== undefined && maxRate.length) {
        conditionObject.rate = { [Op.between]: [minRate, maxRate] };
    }
    else if (minRate !== undefined && minRate.length) {
        conditionObject.rate = { [Op.gte]: minRate };
    }

    else if (maxRate !== undefined && maxRate.length) {
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

