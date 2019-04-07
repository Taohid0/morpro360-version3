const Router = require("koa-router");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const DriverSchema = require("../validation/schema/driver");
const validationUtils = require("../validation/functions/utils");

const router = new Router({
  prefix: "/role"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Role.findAll({});
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

router.get("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Role.findOne({ where: { id } });
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

module.exports = router;
