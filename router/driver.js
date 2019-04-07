const Router = require("koa-router");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const DriverSchema = require("../validation/schema/driver");
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
  prefix: "/driver"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Driver.findAll({});
    ctx.status = HttpStatus.OK;
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
    const promise = await db.Driver.findOne({ where: { id } });

    ctx.status = 200;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 400,
      ctx.body = {
        status: false,
        errors: ["Internal Server error"]
      };
  }
});

router.post("/", async (ctx, next) => {
  const UserId = ctx.UserId;
  
  if(!UserId)
  {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status:false,
      errors:["Authentication failed",]
    }
    await next();
    return;
  }
  const data = ctx.request.body;
  data.userId = UserId;
  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(
    data,
    DriverSchema
  );

  if (validationErrors) {
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }

  try {
    const promise = await db.Driver.create(data);

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

router.get("/company-drivers/:id", async (ctx, next) => {
  const {id} = ctx.params;
  const userId = ctx.UserId;
  const isAdmin = ctx.isAdmin;
  if (!userId && !isAdmin) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = {
      status: false,
      errors: ["Authentication failes"]
    };
    await next();
    return;
  }

  if(!id)
  {
    ctx.status=HttpStatus.OK;
    ctx.body = {
      status:false,
      errors:["id cannot be blank",]
    }
    await next();
    return;
  }
  try {
    const driverPromise = await db.Driver.findAll({
      where: { userId:id },
      attributes: { exclude: ["password",] }
    });
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: driverPromise
    };
    console.log(driverPromise);
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
