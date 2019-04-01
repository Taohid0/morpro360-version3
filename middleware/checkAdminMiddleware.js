const db = require("../models");
const Sequelize = require("sequelize");

async function checkAdminMiddleware(ctx, next) {
  const Op = Sequelize.Op;

  const token = ctx.request.header.authorization;

  if (token) {
    //check whether the token is expired (expiration time : 24 hours)
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);

    try {
      const promise = await db.AdminSession.findOne({
        include: [
          {
            model: db.Admin
          }
        ],
        //raw:true,
        where: { token, updatedAt: { [Op.gt]: thresholdTime } }
      });

      const adminSession = promise.dataValues.Admin.dataValues;
      if (!promise) {
        app.context.isAdmin = false;
        await next();
        return;
      }
      const adminRole = await db.AdminRole.findOne({
        include: [
          {
            model: db.Role
          }
        ],
        where: { adminId: adminSession.AdminId }
      });

      const role = adminRole.dataValues.Role.dataValues;

      adminSession.changed("updatedAt", true);
      adminSession.save();
      app.context.isAdmin = true;
      app.context.role = role.name;
      app.context.AdminId = adminSession.AdminId;
    } catch (err) {
      console.log(err);
      app.context.isAdmin = false;
    }
  } else {
    app.context.isAdmin = false;
  }

  await next();
}

module.exports = checkUserMiddleware;
