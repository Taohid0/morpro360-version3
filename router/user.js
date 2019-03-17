const db = require("../models");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const Router = require("koa-router");
const HttpStatus = require("http-status-codes");
const userUtil = require("../utils/user");

//_previousDataValue or dataValue? should be checcked using postman

passport.use(
  new Strategy((username, password, cb) => {
    db.User.findOne({ where: { userName: username } }).then(user => {
      if (!user) {
        return cb(null, false);
      }
      if (!user.validPassword(password)) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

const router = new Router({
  prefix: "/user"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.User.findAll({});
    ctx.response.status = 200;
    let users = [];
    for (let i = 0; i < promise.length; i++) {
      const data = promise[i]._previousDataValues;
      delete data.password;
      users.push(data);
    }
    ctx.response.status = 200;
    ctx.body = {
      status: true,
      users
    };
    await next();
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = {
      status: false
    };
  }
});

//handle get request for single user
router.get("/:id", async (ctx, next) => {
  try {
    const promise = await db.User.findOne({ where: { id: ctx.params.id } });
    ctx.response.status = 200;
    const data = promise._previousDataValues;
    delete data.password;
    ctx.body = {
      status: true,
      user: data
    };
    await next();
  } catch (err) {
    ctx.response.status = 404;
    ctx.body = {
      status: false
    };
  }
});

//handle post (create) request
router.post("/", async (ctx, next) => {
  try {
    const promise = await db.User.create(ctx.request.body);
    ctx.response.status = 201;
    console.log(promise);
    ctx.body = {
      status: true,
      user: promise._previousDataValues
    };
    const hashString = userUtil.getHash("abc@gmail.com");
    await next();
  } catch (err) {
    ctx.response.status = 400;
    const createErrors = err.errors;
    let errors = [];
    for (const error of createErrors) {
      errors.push(error.message);
    }
    ctx.body = {
      errors
    };
  }
});

//handle put request
router.put("/", async (ctx, next) => {
  //need to complete using tokens model
  try {
    //if token not found return errors
    if (!ctx.request.body.token || !ctx.request.body.id) {
      ctx.response.status = 400;
      ctx.body = {
        status: false,
        errors: "token/id can't be blank"
      };
      return;
    }

    let promise = await db.User.findOne({
      where: { id: ctx.request.body.id }
    });

    if (!promise) {
      ctx.response.status = HttpStatus.NOT_FOUND;
      ctx.body = {
        status: false,
        errors: "user not fount"
      };
      return;
    } //need to complete using tokens model
    if (ctx.request.body.password !== promise.dataValues.password) {
      ctx.response.status = HttpStatus.BAD_REQUEST;
      ctx.body = {
        status: false,
        errors: "user not found"
      };
      return;
    }
    promise = await db.User.update(ctx.request.body, {
      where: { id: ctx.request.body.id }
    });
    if (promise) {
        try {
            const dataPromise = await db.User.findOne({ where: { id: ctx.request.body.id} });
            ctx.response.status = 200;
            const data = dataPromise.dataValues;
            delete data.password;
            ctx.body = {
              status: true,
              user: data
            };
            await next();
          } catch (err) {
            ctx.response.status = HttpStatus.INTERNAL_SERVER_ERROR;
            ctx.body = {
              status: false
            };
          }
    }
  } catch (err) {
    //if any errors return 400
    ctx.response.status = HttpStatus.BAD_REQUEST;
    ctx.body = {
      status: false
    };
  }
});
module.exports = router;
