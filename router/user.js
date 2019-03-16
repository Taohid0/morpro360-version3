const db = require("../models");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const Router = require("koa-router");

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



const router = new Router({
    prefix:"/user"
});


//handle get request
router.get("/:id",async (ctx,next)=>{
    try{
        const promise = await db.User.findOne({where:{"id":ctx.params.id}});
        ctx.response.status=200;
        const data = promise._previousDataValues;
        delete data.password;
        ctx.body={
            status:true,
            user: data
        }
    }
    catch(err){
        ctx.response.status=404;
        ctx.body={
            status:false
        }
    }

    await next();
});

//handle post (create) request
router.post("/", async(ctx,next)=>{
    try{   
        const promise = await db.User.create(ctx.request.body);
        ctx.response.status = 201;
        ctx.body={
            status:true,
            user:promise._previousDataValues
        }
        console.log(promise.json());
    }
    catch(err)
    {
        ctx.response.status = 400;
        const createErrors = err.errors;
        let errors=  [];
        for (const error of createErrors){
            errors.push(error.message);
        }
        ctx.body={
            errors
        }
    }
     await next();
})
module.exports = router;