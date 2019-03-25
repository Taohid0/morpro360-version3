const db = require("../../models");
const Router = require("koa-router");
const bcrypt = require("bcrypt-nodejs");
const HttpStatus = require("http-status-codes");

const userUtils = require("../../utils/user");
const tokenValidation = require("../../utils/token");

const router = new Router({
    prefix:"/auth"
});



//user login router using email and password
router.post("/login", async (ctx,next)=>{
    const data = ctx.request.body;
    const email = data.email;
    const password = data.password;

    //if email or password not present return error
    if(!email || !password){
        ctx.status = HttpStatus.BAD_REQUEST;
        ctx.body = {
            status:false,
            errors:["email of password cannot be blank",]
        }
        return;
    }

    //find user using email
    const promise = await db.User.findOne({where:{email:email}});
    //if no user found return error
    if (!promise){
        ctx.status = HttpStatus.OK;
        ctx.body ={
            status:false,
            errors:["user not found",]
        }
        return;
    }

    const existingToken = await tokenValidation.isTokenExists(email);
    console.log(existingToken,Boolean(existingToken));

    const userData = promise.dataValues;

    //compare password using bcrypt package
    const isAuthencated = bcrypt.compareSync(ctx.request.body.password, userData.password);
    //if password mismatched return error
    if(!isAuthencated){
        ctx.status = HttpStatus.OK;
        ctx.body = {
            status:false,
            errors:["email/password mismatched",]
        }
        return;
    }
    //generate hash string using email and password
    const hashString = userUtils.getHash(email,password);
    //create session data to session table
    const sessionPromise  = await db.Session.create({"token":hashString,UserId:promise.dataValues.id});

    const sessionData = sessionPromise.dataValues;

    //delete password from user data
    delete userData.password;

    userData.token = sessionData.token;

    //set status and response for successful request
    ctx.status = HttpStatus.OK;
    ctx.body = {
        status:true,
        data:userData
    }

    //call next middleware
    next();
});

module.exports = router;