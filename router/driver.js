const Router = require("koa-router");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const DriverSchema = require("../validation/schema/driver");
const validationUtils = require("../validation/functions/utils");
const ctxHelper = require("../helper/ctxHelper");

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
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: promise
    });
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: ["Internal server error"]
    });
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
  }
  await next();
});

router.get("/details/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Driver.findOne({ where: { id } });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: "nothing here now" //promise
    });
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: ["Internal server error"]
    });
  }
  await next();
});

router.post("/", async (ctx, next) => {
  const userId = ctx.userId;

  if (!userId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  const data = ctx.request.body;
  data.userId = userId;
  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(
    data,
    DriverSchema
  );

  if (validationErrors) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: validationErrors
    });
    await next();
    return;
  }

  try {
    const promise = await db.Driver.create(data);

    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
    ctx.status = HttpStatus.OK;
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: false, errors });
  }
  await next();
});

router.get("/company-drivers/:id", async (ctx, next) => {
  const userId = ctx.userId;
  const isAdmin = ctx.isAdmin;
  const { id } = ctx.params;
  
  if (!userId && !isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  if(!id)
  {
    ctx = ctxHelper.setResponse(ctx,HttpStatus.OK,{status:false,errors:["id cannot be blank"]});
    await next();
    return;
  }

  try {
    const driverPromise = await db.Driver.findAll({
      where: { userId:id },
      attributes: { exclude: ["password"] }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: driverPromise
    });
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
