const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const companyValidation = require("../validation/functions/company");
const tokenValidation = require("../utils/token");

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
      "prefix":"/company"
  });

  router.get("/", async(ctx,next)=>{
    try{
      const promise = await db.Company.findAll({});
      ctx.status = 200;
      ctx.body = {
        status:true,
        data:promise
      }
    await next();
    }
    catch(err)
    {
      console.log(err);
      ctx.status = 500;
      ctx.body = {
        status:false,
        errors: ["Internal server error",]
      }
    }

  });

  router.get("/:id", async(ctx,next)=>{
    try{
      const {id}= ctx.params;
      const promise = await db.Company.findOne({where:{id}});

      ctx.status = 200;
      ctx.body = {
        status:true,
        data: promise
      };
      await next();
    }
    catch(err)
    {
      ctx.status = 400,
      ctx.body = {
        status:false,
        errors: ["Internal Server error",]
      }
    }
  })

router.post("/",async (ctx,next)=>
{
    const data = ctx.request.body;

    //validate data using joi package
    const validationErrors = companyValidation.isValidCompanyData(data);
    
    if (validationErrors)
    {
        ctx.body = {
            status: false,
            errors : validationErrors
        }
        return;
    }
    const {token} = data;
    const isValidToken = await tokenValidation.checkTokenValidation(token)
    console.log(isValidToken);
    //check token is valid
    //this check will be added later

    

    
})

module.exports = router;