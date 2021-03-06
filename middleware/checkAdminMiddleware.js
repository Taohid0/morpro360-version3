const db = require("../models");
const Sequelize = require("sequelize");

async function checkAdminMiddleware(ctx, next) {
  const Op = Sequelize.Op;

  const token = ctx.request.header.authorization;
  console.log("token", token);

  if (token) {
    //check whether the token is expired (expiration time : 24 hours)
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours() - 24);

    try {
      const promise = await db.AdminSession.findOne({
        include: [
          {
            model: db.Admin,
            as:"admin",
            include: {
              model: db.Role,
              // as:"role"
            }
          }
        ],
        // raw:true,
        where: { token, updatedAt: { [Op.gt]: thresholdTime } }
      });

      if (!promise) {
        app.context.isAdmin = false;
        await next();
        return;
      }
      const role = promise.dataValues.admin.dataValues.Role.name;

      promise.changed("updatedAt", true);
      promise.save();

      app.context.isAdmin = true;
      app.context.role = role;
      app.context.adminId = promise.adminId;
    } catch (err) {
      console.log(err);
      app.context.isAdmin = false;
    }
  } else {
    app.context.isAdmin = false;
  }

  await next();
}

module.exports = checkAdminMiddleware;
