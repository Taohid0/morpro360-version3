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
const ctxHelpter = require("../helper/ctxHelper");

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
    (ctx.status = 400),
      (ctx.body = {
        status: false,
        errors: ["Internal Server error"]
      });
  }
});

router.post("/", async (ctx, next) => {
  const data = ctx.request.body;
  const UserId = ctx.UserId;
  const active = ctx.active;
  console.log("request ", data);
  console.log(UserId);

  if (!UserId || !active) {
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
  if (!UserId) {
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status: false,
      errors: ["Authentication failed"]
    };
    return;
  }

  try {
    const bidPromise = await db.Bid.findAll({
      where: { bidderId: UserId },
      include: [
        {
          model: db.Load,
          as: "load",
          attributes: { exclude: ["pickUpaddress", "dropOffaddress"] }
        },
        {
          model: db.Driver,
          as: "driver"
          //attributes:{exclude:["pickUpaddress","dropOffaddress"]}
        },
        {
          model: db.User,
          as: "bidder",
          attributes: { exclude: ["password"] }
        }
      ]
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
router.get("/winning-bids", async (ctx, next) => {
  const Op = Sequelize.Op;

  const UserId = ctx.UserId;

  console.log("ctx", ctx);

  if (!UserId) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: ["Authentication failed"]
    };
    return;
  }

  try {
    const bidPromise = await db.Bid.findAll({
      where: { bidderId: UserId, isAssigned: true },
      include: {
        model: db.Load,
        as: "load",
        include: {
          model: db.Admin,
          as: "admin"
        }
      }
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

router.post("/assign", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;

  if (!isAdmin) {
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
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
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK, {
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
      ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK, { status: true });
      await next();
    }
  } catch (err) {
    console.log(err);
    ctx.status = ctx = ctxHelpter.setResponse(
      ctx,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { status: false, errors: ["Internal Server error", ,] }
    );
  }
});

module.exports = router;
