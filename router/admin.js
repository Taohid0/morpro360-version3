const Router = require("koa-router");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const HttpStatus = require("http-status-codes");
const userUtils = require("../utils/user");

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
  const promise = await db.Admin.findOne({
    where: { email: email },
    include: [
      {
        model: db.Role
      }
    ]
  });
  //if no admin found return error
  if (!promise) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["admin not found"]
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
    delete adminData.password;

    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: adminData
    });
    await next();
    return;
  }

  //generate hash string using email and password
  const hashString = userUtils.getHash(email, password);
  //create session data to session table
  const sessionPromise = await db.AdminSession.create({
    token: hashString,
    AdminId: promise.dataValues.id
  });

  const sessionData = sessionPromise.dataValues;

  //delete password from admin data
  delete adminData.password;

  adminData.token = sessionData.token;

  //set status and response for successful request
  ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
    status: true,
    data: adminData
  });
  //call next middleware
  await next();
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Admin.findAll({
      attributes: { exclude: ["password"] }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: promise
    });
    await next();
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: ["Interlan server error"]
    });
  }
});

router.get("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Admin.findOne({
      where: { id },
      attributes: { exclude: ["password"] }
    });

    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: promise
    });
    await next();
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: ["Interlal server error"]
    });
  }
});

router.post("/", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  const role = ctx.role || "";

  if (!isAdmin || !(role.toLowerCase() === "admin")) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
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
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: validationErrors
    });
    await next();
    return;
  }

  try {
    const promise = await db.Admin.create(data);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });

    await next();
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
});

router.get("/company-drivers", async (ctx, next) => {
  const userId = ctx.UserId;
  if (!userId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  try {
    const loadPromise = await db.Driver.findAll({
      where: { userId }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: loadPromise
    });
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: ["Internal server errors"]
    });
  }
  await next();
});
router.post("/logout", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  const AdminId = ctx.AdminId;
  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  try {
    const promise = await db.AdminSession.destroy({
      where: { AdminId }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: ["Internal server error"]
    });
  }
  await next();
});

module.exports = router;
