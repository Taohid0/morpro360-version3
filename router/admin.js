const Router = require("koa-router");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const AdminSchema = require("../validation/schema/admin");
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
  prefix: "/admin"
});
//admin login router using email and password
router.post("/login", async (ctx, next) => {
  const data = ctx.request.body;
  const email = data.email;
  const password = data.password;

  //if email or password not present return error
  if (!email || !password) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["email or password cannot be blank"]
    });
    await next();
    return;
  }

  //find admin using email
  const promise = await db.Admin.findOne({ where: { email: email } });
  //if no user found return error
  if (!promise) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["user not found"]
    });
    await next();
    return;
  }

  const adminData = promise.dataValues;

  //compare password using bcrypt package
  const isAuthencated = bcrypt.compareSync(
    ctx.request.body.password,
    adminData.password
  );
  //if password mismatched return error
  if (!isAuthencated) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["email/password mismatched"]
    });
    await next();
    return;
  }

  const existingToken = await tokenValidation.isAdminTokenExists(email);

  if (existingToken) {
    adminData.token = existingToken.dataValues.token;

    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: adminData
    };
    await next();
    return;
  }

  //generate hash string using email and password
  const hashString = userUtils.getHash(email, password);
  //create session data to session table
  const sessionPromise = await db.AdminSession.create({
    token: hashString,
    UserId: promise.dataValues.id
  });

  const sessionData = sessionPromise.dataValues;

  //delete password from user data
  delete userData.password;

  userData.token = sessionData.token;

  //set status and response for successful request
  ctx.status = HttpStatus.OK;
  ctx.body = {
    status: true,
    data: userData
  };

  //call next middleware
  await next();
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Admin.findAll({
      attributes: { exclude: ["password"] }
    });
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
    const promise = await db.Admin.findOne({
      where: { id },
      attributes: { exclude: ["password"] }
    });

    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    console.log(err);
    (ctx.status = HttpStatus.INTERNAL_SERVER_ERROR),
      (ctx.body = {
        status: false,
        errors: ["Internal Server error"]
      });
  }
});

router.post("/", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  const role = ctx.role || "";

  if (!isAdmin || !(role.toLowerCase() === "admin")) {
    ctx.status = HttpStatus.UNAUTHORIZED;

    ctx.body = {
      status: false,
      errors: ["Authentication failed"]
    };
    await next();
    return;
  }
  const data = ctx.request.body;

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(
    data,
    AdminSchema
  );

  if (validationErrors) {
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }

  try {
    const promise = await db.Admin.create(data);
    console.log(data);
    // const rolePromise = await db.AdminRole.create({})
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

      where: { userId }
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
