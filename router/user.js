const db = require("../models");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const Router = require("koa-router");
const HttpStatus = require("http-status-codes");
const userUtil = require("../utils/user");
const Sequelize = require("sequelize");

const UserSchema = require("../validation/schema/user");
const validationUtils = require("../validation/functions/utils");
const ctxHelper = require("../helper/ctxHelper");
//_previousDataValue or dataValue? should be checcked using postman

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
  prefix: "/user"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.User.findAll({});
    let users = [];
    for (let i = 0; i < promise.length; i++) {
      const data = promise[i].dataValues;
      delete data.password;
      users.push(data);
    }
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true, users });
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false
    });
  }
  await next();
});

// handle get request for single user
router.get("/details/:id", async (ctx, next) => {
  const { id } = ctx.params;
  const userId = ctx.userId;
  if (!id) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["id cannot be blank"]
    });
    await next();
    return;
  }
  if (!userId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  try {
    const promise = await db.User.findOne({
      where: { id },
      attributes: { exclude: ["password"] }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: promise
    });
  } catch (err) {
    console.log(err);
    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false
    });
  }
  await next();
});
//handle post (create) request
router.post("/", async (ctx, next) => {
  const data = ctx.request.body;

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(data, UserSchema);

  if (validationErrors) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: validationErrors
    });
    await next();
    return;
  }

  //check whether username is already taken
  //this manual checking is needed because we won't have username in login with gmail mechanish
  // const userNameTaken = await userUtil.isUserNameTaken(ctx);
  // if (userNameTaken) {
  //   ctx  = ctxHelper.setResponse(ctx,HttpStatus.OK,{status:false,errors:["username already used"]});
  //   ctx.status = HttpStatus.OK;
  //   ctx.body = {
  //     status: false,
  //     errors: ["username already used"]
  //   };
  //   return;
  // }

  try {
    //create new user from post data
    const promise = await db.User.create(data);

    //generate hashString for token
    const hashString = userUtil.getHash(data.email, data.password);

    //create session
    const sessionPromise = await db.Session.create({
      token: hashString,
      userId: promise.dataValues.id
    });

    //extract user data and remove password field
    const userData = promise.dataValues;
    delete userData.password;

    //extract session data
    const sessionData = sessionPromise.dataValues;

    //token added to user data
    userData.token = sessionData.token;
    //set status and response
    ctx = ctxHelper.setResponse(ctx, HttpStatus.CREATED, {
      status: true,
      data: userData
    });
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }
    //set status code and response body for error
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: false, errors });
  }
  await next();
});

//handle put request
router.put("/", async (ctx, next) => {
  ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
    status: true,
    data: "nothing here now"
  });
});

router.get("/all-users", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  const role = ctx.role;
  const AdminId = ctx.AdminId;

  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }

  let { status } = ctx.query;
  console.log(status);
  if (!status) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["status cannot be blank"]
    });
    await next();
    return;
  }
  try {
    const Op = Sequelize.Op;
    const promise = await db.User.findAll({
      where: { active: status },
      includes: [
        {
          model: db.Driver,
          required: true
        }
      ]
    });
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
  }
  await next();
});

router.post("/activate", async (ctx, next) => {
  const data = ctx.request.body;
  const id = data.id;

  const isAdmin = ctx.isAdmin;
  const role = ctx.role;
  const AdminId = ctx.AdminId;
  console.log("ID", id);
  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  if (!id) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["id cannot be blank"]
    });
    await next();
    return;
  }

  try {
    const promise = await db.User.update({ active: true }, { where: { id } });
    if (promise) {
      ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
    } else {
      ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
        status: true
      });
    }
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }

    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: errors
    });
  }
  await next();
});

router.post("/deactivate", async (ctx, next) => {
  const data = ctx.request.body;
  const id = data.id;

  const isAdmin = ctx.isAdmin;
  const role = ctx.role;
  const AdminId = ctx.AdminId;
  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  if (!id) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["id cannot be blank"]
    });
    await next();
    return;
  }

  try {
    const promise = await db.User.update({ active: false }, { where: { id } });
    if (promise) {
      ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
    } else {
      ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
        status: true
      });
    }
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }

    ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
      status: false,
      errors: errors
    });
  }
  await next();
});

module.exports = router;
