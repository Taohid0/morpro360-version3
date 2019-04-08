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
const ctxHelper = require("../helper/ctxHelper");

const router = new Router({
  prefix: "/bid"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Bid.findAll({});
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      //data: promise
      data: "nothing here at this moment"
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

router.get("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Bid.findOne({ where: { id } });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      //data: promise
      data: "nothing here at this moment"
    });
    // ctx.status = 200;
    // ctx.body = {
    //   status: true,
    //   data: promise
    // };
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
  const data = ctx.request.body;
  const UserId = ctx.UserId;
  const active = ctx.active;
  console.log("request ", data);
  console.log(UserId);

  if (!UserId || !active) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  //validate data using joi package
  data.bidderId = UserId;
  const validationErrors = validationUtils.isValidRequestData(data, BidSchema);

  if (validationErrors) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: validationErrors
    });
    await next();
    return;
  }

  try {
    const promise = await db.Bid.create(data);

    if (!promise) {
      ctx = ctxHelper.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {
        status: false,
        errors: ["Internal server error"]
      });
      await next();
      return;
    }
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: false });
  }
  await next();
});

router.get("/my-bids", async (ctx, next) => {
  const Op = Sequelize.Op;

  const UserId = ctx.UserId;
  if (!UserId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }

  try {
    const bidPromise = await db.Bid.findAll({
      where: { bidderId: UserId },
      include: [
        {
          model: db.Load,
          as: "load",
          attributes: { exclude: ["pickUpAddress", "dropOffAddress"] }
        },
        {
          model: db.Driver,
          as: "driver"
        },
        {
          model: db.User,
          as: "bidder",
          attributes: { exclude: ["password"] }
        }
      ]
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: bidPromise
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
router.get("/winning-bids", async (ctx, next) => {
  const Op = Sequelize.Op;

  const UserId = ctx.UserId;

  console.log("UserId", UserId);

  if (!UserId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }

  try {
    const bidPromise = await db.Bid.findAll({
      where: { bidderId: UserId, isAssigned: true },
      include: [
        {
          model: db.Load,
          as: "load",
          include: [
            {
              model: db.Admin,
              as: "admin",
              attributes: { exclude: ["password"] }
            }
          ]
        },
        {
          model: db.Driver,
          as: "driver",
          attributes: { exclude: ["password"] }
        },
        {
          model: db.User,
          as: "bidder",
          attributes: { exclude: ["password"] }
        }
      ]
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: bidPromise
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

router.post("/assign", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;

  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  const data = ctx.request.body;
  const bidId = data.bidId;
  const loadId = data.loadId;

  if (!bidId || !loadId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["bidId or loadId cannot be blank"]
    });
    await next();
    return;
  }
  try {
    const promise = await db.Bid.update(
      { isAssigned: true },
      { where: { id: bidId } }
    );
    const loadPromise = await db.Load.update(
      { status: "P" },
      { where: { id: loadId } }
    );
    console.log(promise, loadPromise);
    if (promise && loadPromise) {
      ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
    }
  } catch (err) {
    console.log(err);
    ctx.status = ctx = ctxHelper.setResponse(
      ctx,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { status: false, errors: ["Internal Server error", ,] }
    );
  }
  await next();
});

module.exports = router;
