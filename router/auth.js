const db = require("../models");
const Router = require("koa-router");
const bcrypt = require("bcrypt-nodejs");
const HttpStatus = require("http-status-codes");

const userUtils = require("../utils/user");

const router = new Router({
    prefix:"/auth"
});



//user login router using email and password
router.post("/login", async (ctx,next)=>{
    const data = ctx.request.body;
    const email = data.email;
    const password = data.password;
    if(!email || !password){
        ctx.status = HttpStatus.BAD_REQUEST;
        ctx.body = {
            status:false,
            errors:"email of password cannot be blank"
        }
        return;
    }
    const promise = await db.User.findOne({where:{email:email}});
    if (!promise){
        ctx.status = HttpStatus.UNAUTHORIZED;
        ctx.body ={
            status:false,
            errors:"user not found"
        }
        return;
    }
    const isAuthencated = bcrypt.compareSync(ctx.request.body.password, promise.dataValues.password);
    if(!isAuthencated){
        ctx.status = HttpStatus.UNAUTHORIZED;
        ctx.body = {
            status:false,
            errors:"email/password mismatched"
        }
        return;
    }

    const hashString = userUtils.getHash(email,password);
    const sessionPromise  = await db.Session.create({"token":hashString,UserId:promise.dataValues.id});

    delete promise.dataValues.password;

    ctx.status = HttpStatus.OK;
    ctx.body = {
        status:true,
        user:promise.dataValues,
        session:sessionPromise
    }

    next();
});
module.exports = router;