const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const LoadSchema = require("../validation/schema/load");
const validationUtils = require("../validation/functions/utils");
const ctxHelper = require("../helper/ctxHelper");
const configureSearch = require("./utils");
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
  prefix: "/load"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Load.findAll({});
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: "nothing here now" //promise
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

router.get("/details/:id", async (ctx, next) => {
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
    const { id } = ctx.params;
    const promise = await db.Load.findOne({
      where: { id },
      attributes: { exclude: ["pickUpAddress", "dropOffAddress"] }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
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

router.get("/details/all-fields/:id", async (ctx, next) => {
  const UserId = ctx.UserId;
  const isAdmin = ctx.isAdmin;

  if (!UserId && !isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });

    await next();
    return;
  }

  try {
    const { id } = ctx.params;
    const promise = await db.Load.findOne({
      where: { id },
      include: [
        {
          model: db.Admin,
          as: "admin",
          attributes: { exclude: ["password"] },
          include: [
            {
              model: db.Role
            }
          ]
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

router.post("/", async (ctx, next) => {
  const data = ctx.request.body;

  if (!ctx.isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(data, LoadSchema);

  if (validationErrors) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: validationErrors
    });
    await next();
    return;
  }

  try {
    //need to update this
    data.adminId = ctx.AdminId;
    const promise = await db.Load.create(data);
    const laodData = promise.dataValues;
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
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
  await next();
});

router.post("/available-load", async (ctx, next) => {
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

  if (!ctx.active) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: [
        "You account is not active yet. You'll see the load boards when it's active."
      ]
    });
    await next();
    return;
  }

  try {
    const bidPromise = await db.Bid.findAll({
      where: { bidderId: UserId },
      attributes: ["loadId"]
    });
    const loadIds = bidPromise.map(bid => {
      return bid.loadId;
    });

    let conditionObject = {};
    conditionObject.status = "A";
    conditionObject.id = { [Op.notIn]: loadIds };
    
    conditionObject = configureSearch.configureConditionObject(ctx,conditionObject);

    console.log(conditionObject)
    const loadPromise = await db.Load.findAll({
      include: [
        {
          model: db.Admin,
          as: "admin"
        }
      ],
      order: [["createdAt", "ASC"]],
      // where: { status: "A", id: { [Op.notIn]: loadIds } },
      where: conditionObject,
      attributes: { exclude: ["pickUpAddress", "dropOffAddress"] }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: loadPromise
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

router.get("/all-loads-admin", async (ctx, next) => {
  let { status } = ctx.query;
  if (!status) {
    status = "A";
  }
  const isAdmin = ctx.isAdmin;

  console.log(isAdmin);

  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }

  let sortingOrder = "ASC";
  if (status === "A") {
    sortingOrder = "DESC";
  }
  try {
    const loadPromise = await db.Load.findAll({
      include: [
        {
          model: db.Admin,
          as: "admin",
          attributes: { exclude: ["password"] },
          include: [{ model: db.Role }]
        }
      ],
      order: [["createdAt", sortingOrder]],
      where: { status }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: loadPromise
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

//url ta query param use kore korte hobe
router.get("/bids", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  let { loadId } = ctx.query;
  if (!isAdmin) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }

  if (!loadId) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      errors: ["loadId cannot be blank"]
    });
    await next();
    return;
  }

  try {
    const promise = await db.Bid.findAll({
      include: [
        {
          model: db.User,
          as: "bidder",
          attributes: { exclude: ["password"] }
        },
        {
          model: db.Driver,
          as: "driver",
          attributes: { exclude: ["password"] }
        }
      ],
      order: [["rate", "ASC"], ["createdAt", "ASC"]],
      where: { loadId }
    });
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: true,
      data: promise
    });
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status: false,
      errors: ["Internal Server error"]
    };
  }
  await next();
});

router.post("/change-status", async (ctx, next) => {
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
  const loadId = data.loadId;
  const status = data.status;

  if (!loadId || !status) {
    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["loadId or status cannot be blank"]
    });
    await next();
    return;
  }
  try {
    const loadPromise = await db.Load.update(
      { status: status },
      { where: { id: loadId } }
    );

    ctx = ctxHelper.setResponse(ctx, HttpStatus.OK, { status: true });
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
