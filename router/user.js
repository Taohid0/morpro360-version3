const db = require("../models");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const Router = require("koa-router");
const HttpStatus = require("http-status-codes");
const userUtil = require("../utils/user");
const Sequelize = require("sequelize");

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
    ctx.status = 200;
    let users = [];
    for (let i = 0; i < promise.length; i++) {
      const data = promise[i].dataValues;
      delete data.password;
      users.push(data);
    }
    ctx.status = 200;
    ctx.body = {
      status: true,
      users
    };
    await next();
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: false
    };
  }
});

//handle get request for single user
router.get("/:id", async (ctx, next) => {
  try {
    const promise = await db.User.findOne({ where: { id: ctx.params.id } });
    ctx.status = 200;
    const data = promise.dataValues;
    delete data.password;
    ctx.body = {
      status: true,
      user: data
    };
    await next();
  } catch (err) {
    ctx.status = 404;
    ctx.body = {
      status: false
    };
  }
});

//handle post (create) request
router.post("/", async (ctx, next) => {

  const userNameTaken = await userUtil.isUserNameTaken(ctx);
  if(userNameTaken){
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body={
      status:false,
      errrs : "userName alrady used"
    }
    return;
  }

  try {
    //create new user from post data
    const promise = await db.User.create(ctx.request.body);
    
    //generate hashString for token
    const hashString = userUtil.getHash(ctx.request.body.email);
    //create session
    const sessionPromise  = await db.Session.create({token:hashString,UserId:promise.dataValues.id});
    //set status and response   
    ctx.status=HttpStatus.CREATED
    ctx.body = {
      status: true,
      user: promise.dataValues,
      session: sessionPromise.dataValues
    };
    //if everything goes fine then call next middleware
    await next();
  } catch (err) {
    //if any error occurs set status code
    ctx.status = HttpStatus.BAD_REQUEST;
    const createErrors = err.errors;
    let errors = [];
    //loop through the errors and create an array of errors
    for (const error of createErrors) {
      errors.push(error.message);
    }
    ctx.body = {
      status:false,
      errors
    };
  }
});

//handle put request
router.put("/", async (ctx, next) => {
  const Op = Sequelize.Op;
  //need to complete using tokens model
  try {
    //if token/UserId not found return errors
    if (!ctx.request.body.token || !ctx.request.body.UserId) {
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = {
        status: false,
        errors: "token/UserId can't be blank"
      };
      return;
    }

    //check whether the token is expired (expiration time : 24 hours)
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours()-24)

    console.log(thresholdTime.toUTCString());
    const thresoldPromise = await db.Session.findOne({
      where: { UserId: ctx.request.body.UserId,token:ctx.request.body.token,updatedAt: { [Op.gt]: thresholdTime} }
    });
    
    //if token expired return errors
    if (!thresoldPromise) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = {
        status: false,
        errors: "token expired"
      };
      return;
    }
    //update user data
    promise = await db.User.update(ctx.request.body, {
      where: { id: ctx.request.body.UserId }
    });

    if (promise) {
        try {
            //find updated user data and remove password from retrieved data
            const dataPromise = await db.User.findOne({ where: { id: ctx.request.body.UserId} });
            const data = dataPromise.dataValues;
            delete data.password;
            //retrieve session data
            const sessionPromise = await db.Session.update({token:ctx.request.body.token},{where:{UserId:data.id}});
            //set successful status and response
            ctx.status = HttpStatus.OK;
            ctx.body = {
              status: true,
              user: data,
              session: {token:ctx.request.body.token,UserId:ctx.request.body.UserId}
            };
            //if everything is fine call next middleware
            await next();
          } catch (err) {
            console.log(err);
            //if any error occurs then set 400 status and return false status
            ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
            ctx.body = {
              status: false
            };
          }
    }
  } catch (err) {
    //if any errors return 400
    console.log(err);
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body = {
      status: false
    };
  }
});
module.exports = router;
