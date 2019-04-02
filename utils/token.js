const db = require("../models");
const Sequelize = require("sequelize");

async function checkTokenValidation(token) {
  const Op = Sequelize.Op;
  //check whether the token is expired (expiration time : 24 hours)

  let thresholdTime = new Date();
  thresholdTime.setHours(thresholdTime.getHours() - 24);

  try {
    const promise = await db.Session.findOne({
      where: { token, updatedAt: { [Op.gt]: thresholdTime } }
    });
    console.log(promise);

    if (!promise) {
      deleteExpiredTokens();
      return false;
    } else {
      promise.changed("updatedAt", true);
      promise.save();
      return promise;
    }
  } catch (err) {
    return false;
  }
}

async function deleteExpiredTokens() {
  const Op = Sequelize.Op;
  //check whether the token is expired (expiration time : 24 hours)

  let thresholdTime = new Date();
  thresholdTime.setHours(thresholdTime.getHours() - 24);
  try {
    const deletePromise = await db.Session.destroy({
      where: { updatedAt: { [Op.lt]: thresholdTime } }
    });
    console.log(deletePromise);
    return true;
  } catch (err) {
    return false;
  }
}


async function isTokenExists(email)
{
    const Op = Sequelize.Op;
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);
  
    try {
      const promise = await db.Session.findOne({
        where: {updatedAt: { [Op.gt]: thresholdTime }},
        include: {
            model: db.User,
            where: { email},
          }
      });
      if (!promise) {
        return false;
      } else {
        promise.changed("updatedAt", true);
        promise.save();
        return promise;
      }
    } catch (err) {
        console.log(err);
      return false;
    }
}

async function isAdminTokenExists(email)
{
    const Op = Sequelize.Op;
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);
  
    try {
      const promise = await db.AdminSession.findOne({
        where: {updatedAt: { [Op.gt]: thresholdTime }},
        include: {
            model: db.Admin,
            where: { email},
          }
      });
      if (!promise) {
        return false;
      } else {
        promise.changed("updatedAt", true);
        promise.save();
        return promise;
      }
    } catch (err) {
        console.log(err);
      return false;
    }
}


module.exports = {
  checkTokenValidation,
  deleteExpiredTokens,
  isTokenExists,
  isAdminTokenExists
};
