const db = require("../models");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");

passport.use(
    new Strategy(
        (username,password,cb)=>{
            db.User.findOne({where:{"userName":username}}).then(user=>{
                if (!user){return cb(null,falst)};
                if (!user.validPassword(password)){
                    return cb(null,false);
                }
                return cb(null,user);
            });
        })
);


const Router = require("koa-router");

const router = new Router({
    prefix:"/user"
});


//handle get request
router.get("/",async (ctx,next)=>{
    ctx.body = "hello";
    await next();
});

//handle post (create) request
router.post("/", async(ctx,next)=>{
    try{   
        const promise = await db.User.create(ctx.request.body);
        ctx.response.status = 201;
        ctx.body={
            status:"true",
            user:promise._previousDataValues
        }
    }
    catch(err)
    {
        ctx.response.status = 400;
        const createErrors = err.errors;
        let errors=  [];
        for (error of createErrors){
            errors.push(error.message);
        }
        ctx.body={
            errors
        }
    }
     await next();
})
module.exports = router;