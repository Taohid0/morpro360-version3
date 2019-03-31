const db = require("../models");
const Sequelize = require("sequelize");
const tokenUtils = require("../utils/token");

async function checkToken(ctx, next) {
  const Op = Sequelize.Op;


  const token = ctx.request.header.authorization;
 
  if (token) {
    //check whether the token is expired (expiration time : 24 hours)
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);
    
    try {
      const promise = await db.Session.findOne({include: [
        {
          model: db.User,
    
        }
      ],
      //raw:true,
        where: { token, updatedAt: { [Op.gt]: thresholdTime } }
      });
      
      const user = promise.dataValues.User.dataValues;

      if (!promise) {
        // tokenUtils.deleteExpiredTokens();
        app.context.UserId = null;
        app.context.active = 0;
      } 
      else 
      {
        promise.changed("updatedAt", true);
        promise.save();
        app.context.UserId = promise.dataValues.UserId;
        app.context.active = user.active;
      }
    } 
    catch (err) {
      console.log(err);
      app.context.UserId = null;
      app.context.active = 0;
    }
  }
  else{
      app.context.UserId = null;
      app.context.active = 0;
  }
 

  await next();

}

module.exports = checkToken;
