const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
// const validationUtils = require("../validation/functions/utils");
const CompanySchema = require("../validation/schema/company");
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
  prefix: "/company"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Company.findAll({});
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
      errors: ["Internal server error",]
    };
  }
});

router.get("/:id", async (ctx, next) => {
  try {
    const { id } = ctx.params;
    const promise = await db.Company.findOne({ where: { id } });

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
        errors: ["Internal Server error",]
      });
  }
});

router.post("/", async (ctx, next) => {
  const data = ctx.request.body;

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(data,CompanySchema);

  if (validationErrors) {
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }
  const { token } = data;
  const isValidToken = await tokenValidation.checkTokenValidation(token);
  if (!isValidToken) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: ["Authentication failed",]
    };
    return;
  }
  const sessionData = isValidToken.dataValues;
  try {
    const promise = await db.Company.create(data);
    const companyData = promise.dataValues;

    const companyUserPromise = await db.CompanyUser.create({
      UserId: sessionData.UserId,
      CompanyId: companyData.id
    });
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

router.get("/owned-companies",async (ctx,next)=>{
  const UserId = ctx.UserId;
  if(!UserId)
  {
    ctx.status = HttpStatus.OK;
    ctx.body={
      statue:false,
      errors:["Authorization failed",]
    }
    //await next();
    return;
  }
    

    try{
      const Op = Sequelize.Op
      
      const companyIdPromise= await db.CompanyUser.findAll({where:{UserId},attributes: ["CompanyId",]});

      const companyIds= companyIdPromise.map((company)=>{ return company.CompanyId});

      const companies = await db.Company.findAll({where:{id:{[Op.in]:companyIds}}});

      ctx.status = HttpStatus.OK;
      ctx.body = {
        status:true,
        data : companies
      };
     await next();
    }
    catch(err)
    {
      console.log(err);
      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = {
        status:false,
        errors:["Internal server error",]
      }
    }

})
module.exports = router;
