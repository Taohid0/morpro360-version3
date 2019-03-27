const db = require("../models");
const Sequelize = require("sequelize");
const tokenUtils = require("../utils/token");

async function checkToken(ctx, next) {
  const Op = Sequelize.Op;

  console.log(ctx.request.header);

  const token = ctx.request.header.authorization;

  if (token) {
    //check whether the token is expired (expiration time : 24 hours)
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);
    
    try {
      const promise = await db.Session.findOne({
        where: { token, updatedAt: { [Op.gt]: thresholdTime } }
      });

      if (!promise) {
        tokenUtils.deleteExpiredTokens();
        app.context.UserId = null;
      } 
      else 
      {
        promise.changed("updatedAt", true);
        promise.save();
        app.context.UserId = promise.dataValues.UserId;
      }
    } 
    catch (err) {
      console.log(err);
      app.context.UserId = null;
    }
  }
  else{
      app.context.UserId = null;
  }

  await next();
}

module.exports = checkToken;
