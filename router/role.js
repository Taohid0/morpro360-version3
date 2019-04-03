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
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: promise
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
});

router.get("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Role.findOne({ where: { id } });

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


module.exports = router;
