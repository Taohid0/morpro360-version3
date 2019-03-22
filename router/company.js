const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const companyValidation = require("../validation/functions/company");

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
    //check token is valid
    //this check will be added later

    

    
})