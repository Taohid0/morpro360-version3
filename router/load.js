const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const LoadSchema = require("../validation/schema/load");
const validationUtils = require("../validation/functions/utils");

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
  prefix: "/load"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Load.findAll({
      
    });
    ctx.status = 200;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
});

router.get("/:id", async (ctx, next) => {
  const UserId = ctx.UserId;
  console.log(UserId);
  if (!UserId)
  {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status:false,
      errors : ["Authentication failed",]
    }
    return;
  }

  try {
    const { id } = ctx.params;
    const promise = await db.Load.findOne({
      include: [{
        model: db.User,
        as:"broker",
        where: { id: Sequelize.col('Load.brokerId') }
    },
  //   {
  //     model: db.Company,
  //     as:"offererCompany",
  //     where: { id: Sequelize.col('Load.offererCompanyId') }
  // }
],
      where:{id},
    attributes: { exclude: ['pickUpAddress',"dropOffAddress"] }
  });

    ctx.status = 200;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    (ctx.status = 400),
      (ctx.body = {
        status: false,
        errors: ["Internal Server error"]
      });
  }
});

router.post("/", async (ctx, next) => {
  const data = ctx.request.body;

  if(!ctx.UserId)
  {
    ctx.status = HttpStatus.OK;
    ctx.body  = {
      status:false,
      errors:["Authentication failed",]
    }
    return;
  }

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(data,LoadSchema);

  if (validationErrors) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }

  try {
    
    data.brokerId = ctx.UserId;
    const promise = await db.Load.create(data);
    const laodData = promise.dataValues;

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


router.get("/available-load",async (ctx,next)=>{
  const UserId = ctx.UserId;
  console.log(UserId);
  if (!UserId)
  {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status:false,
      errors : ["Authentication failed",]
    }
    return;
  }
  try{
    const loadPromise = await db.Load.findAll({
      include: [{
        model: db.User,
        as:"broker",
        where: { id: Sequelize.col('Load.brokerId') }
    },
  //   {
  //     model: db.Company,
  //     as:"offererCompany",
  //     where: { id: Sequelize.col('Load.offererCompanyId') }
  // }
],
      where:{status:"A"},
    attributes: { exclude: ['pickUpAddress',"dropOffAddress"] }
  });
    console.log(loadPromise);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status:true,
      data: loadPromise
    }
    await next();
  }
  catch(err)
  {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    status.body = {
      status:false,
      errors:["Internal server error",]
    }
  }
  
})

module.exports = router;
