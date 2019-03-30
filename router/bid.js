const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
// const validationUtils = require("../validation/functions/utils");
const BidSchema = require("../validation/schema/bid");
const validationUtils = require("../validation/functions/utils");

const router = new Router({
  prefix: "/bid"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Bid.findAll({});
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
  try {
    const { id } = ctx.params;
    const promise = await db.Bid.findOne({ where: { id } });

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
  const data = ctx.request.body;
  const UserId = ctx.UserId;
  console.log("request " ,data);
  console.log(UserId);

  if (!UserId) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: ["Authentication failed"]
    };
    return;
  }
  //validate data using joi package
  data.bidderId = UserId;
  const validationErrors = validationUtils.isValidRequestData(data, BidSchema);

  if (validationErrors) {
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }

  try {
    const promise = await db.Bid.create(data);

    if (!promise) {
      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        status: false,
        errors: ["Internal Server Error"]
      };
      return;
    }

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

router.get("/my-bids", async (ctx, next) => {
  const Op = Sequelize.Op;

  const UserId = ctx.UserId;
  if (!UserId)
  {
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status:false,
      errors : ["Authentication failed",]
    }
    return;
  }

  try {

    const bidPromise = await db.Bid.findAll({
      where:{bidderId:UserId},  
      include:[
        {
          model:db.Load,
          as:"load",
          attributes:{exclude:["pickUpaddress","dropOffaddress"]}
        },
        {
          model:db.Driver,
          as:"driver",
          //attributes:{exclude:["pickUpaddress","dropOffaddress"]}
        },
        {
          model:db.User,
          as:"bidder",
          attributes:{exclude:["password"]}
        }
      ],
      // attributes:{exclude:["isAssigned",]}
      
    });

    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: bidPromise
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
