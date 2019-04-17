const db = require("../../models");
const Router = require("koa-router");
const bcrypt = require("bcrypt-nodejs");
const HttpStatus = require("http-status-codes");

const userUtils = require("../../utils/user");
const tokenValidation = require("../../utils/token");
const ctxHelper = require("../../helper/ctxHelper");

const router = new Router({
  prefix: "/auth"
});

//user login router using email and password
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

  //find user using email
  const promise = await db.User.findOne({ where: { email: email } });
  //if no user found return error
  if (!promise) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["user not found"]
    });
    await next();
    return;
  }

  const userData = promise.dataValues;

  //compare password using bcrypt package
  const isAuthencated = bcrypt.compareSync(
    ctx.request.body.password,
    userData.password
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

  const existingToken = await tokenValidation.isTokenExists(email);

  if (existingToken) {
    userData.token = existingToken.dataValues.token;
    delete userData.password;

    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: userData
    });
    ctx.status = HttpStatus.OK;
    await next();
    return;
  }

  //generate hash string using email and password
  const hashString = userUtils.getHash(email, password);
  //create session data to session table
  const sessionPromise = await db.Session.create({
    token: hashString,
    UserId: promise.dataValues.id
  });

  const sessionData = sessionPromise.dataValues;

  //delete password from user data
  delete userData.password;

  userData.token = sessionData.token;

  //set status and response for successful request
  ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
    status: true,
    data: userData
  });
  await next();
});

router.post("/logout", async (ctx, next) => {
  const UserId = ctx.UserId;
  // if (!UserId) {
  //   ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
  //     status: false,
  //     errors: ["Authentication failed,"]
  //   });
  //   await next();
  //   return;
  // }
  try {
    const promise = await db.Session.destroy({
      where: { UserId }
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
