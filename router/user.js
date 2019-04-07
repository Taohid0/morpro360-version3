const db = require("../models");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");
const Router = require("koa-router");
const HttpStatus = require("http-status-codes");
const userUtil = require("../utils/user");
const Sequelize = require("sequelize");


const UserSchema = require("../validation/schema/user");
const validationUtils = require("../validation/functions/utils");
const ctxHelpter = require("../helper/ctxHelper");
//_previousDataValue or dataValue? should be checcked using postman

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
  prefix: "/user"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.User.findAll({});
    ctx.status = 200;
    let users = [];
    for (let i = 0; i < promise.length; i++) {
      const data = promise[i].dataValues;
      delete data.password;
      users.push(data);
    }
    ctx.status = 200;
    ctx.body = {
      status: true,
      users
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      status: false
    };
  }
});

// handle get request for single user
router.get("/:id", async (ctx, next) => {

  try {
    const {id} = ctx.params;
    // const promise = await db.User.findOne({ where: { id } });
    // ctx.status = 200;
    // const data = promise.dataValues;
    // delete data.password;
    
    ctx.body = {
      status: true,
      user: id
    };
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      status: false
    };
  }
});

//handle post (create) request
router.post("/", async (ctx, next) => {
  const data = ctx.request.body;
  
  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(data,UserSchema);

  if(validationErrors)
  {
    ctx.body = {
      status:false,
      errors: validationErrors
    }
    return;
  }

  //check whether username is already taken
  //this manual checking is needed because we won't have username in login with gmail mechanish
  const userNameTaken = await userUtil.isUserNameTaken(ctx);
  if(userNameTaken){
    ctx.status = HttpStatus.OK;
    ctx.body={
      status:false,
      errors : ["username already used",]
    }
    return;
  }

  try {
    //create new user from post data
    const promise = await db.User.create(data);
    
    //generate hashString for token
    const hashString = userUtil.getHash(data.email,data.password);

    //create session
    const sessionPromise  = await db.Session.create({token:hashString,UserId:promise.dataValues.id});
    
    //extract user data and remove password field
    const userData = promise.dataValues;
    delete userData.password;
    
    //extract session data
    const sessionData = sessionPromise.dataValues;

    //token added to user data
    userData.token = sessionData.token;
   //set status and response   
    ctx.status=HttpStatus.CREATED
    ctx.body = {
      status: true,
      data: userData
    };
    //if everything goes fine then call next middleware
    await next();
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }    
    //set status code and response body for error
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status:false,
      errors
    };
  }
});

//handle put request
router.put("/", async (ctx, next) => {
  const Op = Sequelize.Op;
  //need to complete using tokens model
  try {
    //if token/UserId not found return errors
    if (!ctx.request.body.token || !ctx.request.body.UserId) {
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = {
        status: false,
        errors: "token/UserId can't be blank"
      };
      return;
    }

    //check whether the token is expired (expiration time : 24 hours)
    let thresholdTime = new Date();
    thresholdTime.setHours(thresholdTime.getHours()-24)

    console.log(thresholdTime.toUTCString());
    const thresoldPromise = await db.Session.findOne({
      where: { UserId: ctx.request.body.UserId,token:ctx.request.body.token,updatedAt: { [Op.gt]: thresholdTime} }
    });
    
    //if token expired return errors
    if (!thresoldPromise) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = {
        status: false,
        errors: "token expired"
      };
      return;
    }
    //update user data
    promise = await db.User.update(ctx.request.body, {
      where: { id: ctx.request.body.UserId }
    });

    if (promise) {
        try {
            //find updated user data and remove password from retrieved data
            const dataPromise = await db.User.findOne({ where: { id: ctx.request.body.UserId} });
            const data = dataPromise.dataValues;
            delete data.password;
            //retrieve session data
            const sessionPromise = await db.Session.update({token:ctx.request.body.token},{where:{UserId:data.id}});
            //set successful status and response
            ctx.status = HttpStatus.OK;
            ctx.body = {
              status: true,
              user: data,
              session: {token:ctx.request.body.token,UserId:ctx.request.body.UserId}
            };
            //if everything is fine call next middleware
            await next();
          } catch (err) {
            console.log(err);
            //if any error occurs then set 500 status and return false status
            ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
            ctx.body = {
              status: false
            };
          }
    }
  } catch (err) {
    //if any errors return 500
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      status: false
    };
  }
});


router.get("/all-users", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;
  const role = ctx.role;
  const AdminId = ctx.AdminId;

  if(!isAdmin)
  {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body ={
      status:false,
      errors:["Authentication failed",]
    }
    await next();
    return;
  }

  let { status } = ctx.query;
  console.log(status);
  if (!status) {
    ctx = ctxHelpter.setResponse(ctx,HttpStatus.OK,{status:false,errors:["status cannot be blank"]});
    await next();
    return ;
  }
  try {
    const Op = Sequelize.Op;
    const promise = await db.User.findAll({
      where: { active:status },
      includes:[{
        model:db.Driver,
        required:true,
      },],

    });
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: promise,
    };
    
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
  await next();
});


router.post("/activate", async (ctx, next) => {
  const data = ctx.request.body;
  const id = data.id;

  const isAdmin = ctx.isAdmin;
  const role = ctx.role;
  const AdminId = ctx.AdminId;
  console.log("ID",id);
  if(!isAdmin)
  {
    ctx = ctxHelpter.setResponse(ctx,HttpStatus.UNAUTHORIZED,{status:false,errors:["Authentication failed",]});
    await next();
    return;
  }
  if(!id)
  {
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK,{status:false,errors:["id cannot be blank",]});
    await next();
    return;
  }

  try {
    const promise = await db.User.update({active:true},{where:{id}});
    if(promise)
    {
      ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK, {status:true});
    }
    else{
      ctx = ctxHelpter.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {status:true});
    }

    await next();
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }    
    
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {status:false,errors:errors});
  }
});

router.post("/deactivate", async (ctx, next) => {
  const data = ctx.request.body;
  const id = data.id;

  const isAdmin = ctx.isAdmin;
  const role = ctx.role;
  const AdminId = ctx.AdminId;
  console.log("ID",id);
  if(!isAdmin)
  {
    ctx = ctxHelpter.setResponse(ctx,HttpStatus.UNAUTHORIZED,{status:false,errors:["Authentication failed",]});
    await next();
    return;
  }
  if(!id)
  {
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK,{status:false,errors:["id cannot be blank",]});
    await next();
    return;
  }

  try {
    const promise = await db.User.update({active:false},{where:{id}});
    if(promise)
    {
      ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK, {status:true});
    }
    else{
      ctx = ctxHelpter.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {status:true});
    }

    await next();
  } catch (err) {
    console.log(err);
    //loop through the errors and create an array of errors
    const createErrors = err.errors;
    let errors = [];

    for (const error of createErrors) {
      errors.push(error.message);
    }    
    
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.INTERNAL_SERVER_ERROR, {status:false,errors:errors});
  }
});



module.exports = router;
