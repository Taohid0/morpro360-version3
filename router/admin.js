const Router = require("koa-router");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const AdminSchema = require("../validation/schema/admin");
const validationUtils = require("../validation/functions/utils");

// passport.use(
//   new Strategy((username, password, cb) => {
//     db.User.findOne({ where: { userName: username } }).then(user => {
//       if (!user) {
//         return cb(null, false);
//       }
//       if (!user.validPassword(password)) {
//         return cb(null, false);
//       }
//       return cb(null, user);
//     });
//   })
// );

const router = new Router({
  prefix: "/admin"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Admin.findAll({
        attributes: { exclude: ["password",] }
    });
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
});

router.get("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Admin.findOne({ where: { id },
        attributes: { exclude: ["password",] } });

    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR,
      ctx.body = {
        status: false,
        errors: ["Internal Server error"]
      };
  }
});

router.post("/", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  const role = ctx.role || "";
  
  if(!isAdmin || !(role.toLowerCase="admin"))
  {
    ctx.status = HttpStatus.UNAUTHORIZED;

    ctx.body = {
      status:false,
      errors:["Authentication failed",]
    }
    await next();
    return;
  }
  const data = ctx.request.body;

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(
    data,
    AdminSchema);

  if (validationErrors) {
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }

  try {
    console.log("line 103, this will be added soon");
    const promise = await db.Admin.create(data);

    const rolePromise = await db.AdminRole.create({})
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true
    };
    await next();
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors
    };
  }
});

router.get("/company-drivers", async (ctx, next) => {
  const userId = ctx.UserId;
  if (!userId) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: ["Authentication failes"]
    };
    return;
  }
  try {
    const loadPromise = await db.Driver.findAll({
      // include: [
      //   {
      //     model: db.Admin,
      //     as: "broker"
          // where: { id: Sequelize.col("Load.brokerId") }
      //   }
      // ],
      //   {
      //     model: db.Company,
      //     as:"offererCompany",
      //     where: { id: Sequelize.col('Load.offererCompanyId') }
      // }

      where: { userId },
      // attributes: { exclude: ["pickUpAddress", "dropOffAddress"] }
    });
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: loadPromise
    };
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    status.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
  await next();
});

module.exports = router;
