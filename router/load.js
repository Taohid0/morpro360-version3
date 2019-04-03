const Router = require("koa-router");
const Sequelize = require("sequelize");
const passport = require("../config/passport");
const Strategy = require("passport-local").Strategy;
const HttpStatus = require("http-status-codes");

const db = require("../models");
const tokenValidation = require("../utils/token");
const LoadSchema = require("../validation/schema/load");
const validationUtils = require("../validation/functions/utils");
const ctxHelpter = require('../helper/ctxHelper');
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
  prefix: "/load"
});

router.get("/", async (ctx, next) => {
  try {
    const promise = await db.Load.findAll({});
    ctx.status = 200;
    ctx.body = {
      status: true,
      data: promise
    };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
  await next();
});


router.get("/:id", async (ctx, next) => {
  const UserId = ctx.UserId;
  console.log("userid",UserId);
  if (!UserId) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: ["Authentication failed"]
    };
    await next();
    return;
  }

  try {
    const { id } = ctx.params;
    const promise = await db.Load.findOne({

      where: { id },
      attributes: { exclude: ["pickUpAddress", "dropOffAddress"] }
    });

    ctx.status = 200;
    ctx.body = {
      status: true,
      data: promise
    };
   
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status: false,
      errors: ["Internal Server error"]
    };
  }
   await next();
});

router.post("/", async (ctx, next) => {
  const data = ctx.request.body;
  
  if (!ctx.isAdmin) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = {
      status: false,
      errors: ["Authentication failed"]
    };
    return;
  }

  //validate data using joi package
  const validationErrors = validationUtils.isValidRequestData(data, LoadSchema);

  if (validationErrors) {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: false,
      errors: validationErrors
    };
    return;
  }

  try {
    //need to update this
    data.adminId = ctx.AdminId;
    const promise = await db.Load.create(data);
    const laodData = promise.dataValues;

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

router.get("/available-load", async (ctx, next) => {
  const Op = Sequelize.Op;

  const UserId = ctx.UserId;

  console.log("ctx",ctx);

  if (!UserId)
  {
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status:false,
      errors : ["Authentication failed",]
    }
    return;
  }

  if(!ctx.active)
  {
    ctx.status = HttpStatus.OK;
    ctx.body = 
    {
      status:false,
      errors:["You account is not active yet. You'll see the load boards when it's active.",]
    }
    return;
  }
 

  try {

    const bidPromise = await db.Bid.findAll({
      where:{bidderId:UserId},
      attributes:["loadId"]
    });
    const loadIds = bidPromise.map(bid=>{
      return bid.loadId;
    })
    console.log(loadIds);
    const loadPromise = await db.Load.findAll({
      include: [
        {
          model: db.Admin,
          as: "admin",
          // where: { id: Sequelize.col("Load.brokerId") }
        }
      ],
     
      where: { status: "A",
      id:{[Op.notIn]:loadIds}},
      attributes: { exclude: ["pickUpAddress", "dropOffAddress"] }
    });
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: loadPromise
    };
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    status.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
  await next();
});

router.get("/available-load-admin", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;

console.log(isAdmin);

  if (!isAdmin)
  {
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status:false,
      errors : ["Authentication failed",]
    }
    return;
  }

 

  try {
    const loadPromise = await db.Load.findAll({
      include: [
        {
          model: db.Admin,
          as: "admin",
          // where: { id: Sequelize.col("Load.brokerId") }
        }
      ],
      where: { status: "A",}
    });
    ctx.status = HttpStatus.OK;
    ctx.body = {
      status: true,
      data: loadPromise
    };
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    status.body = {
      status: false,
      errors: ["Internal server error"]
    };
  }
  await next();
});



//url ta query param use kore korte hobe
router.get("/bids/:id", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;

  if (!isAdmin) {
    ctx = ctxHelpter.setResponse(ctx,HttpStatus.UNAUTHORIZED,{errors:["Authentication failed",]});
    await next();
    return;
  }
  try {
    const { id } = ctx.params;
    const promise = await db.Bid.findAll({
        include: [{
          model: db.User,
          as:"bidder",
          attributes: { exclude: ["password",] }
      },
        {
          model: db.Driver,
          as:"driver",
          attributes: { exclude: ["password",] }
      }
      ],
      where: { loadId:id },
  
    });
    ctx = ctxHelpter.setResponse(ctx,HttpStatus.OK,{status:true,data:promise});
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = HttpStatus.Ok;
    ctx.body = {
      status: false,
      errors: ["Internal Server error",]
    };
  }
});

router.post("/change-status", async (ctx, next) => {
  const isAdmin = ctx.isAdmin;

  if (!isAdmin) {
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.UNAUTHORIZED, {
      status: false,
      errors: ["Authentication failed"]
    });
    await next();
    return;
  }
  const data = ctx.request.body;
  const loadId = data.loadId;
  const status = data.status;

  if (!loadId || !status) {
    ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK, {
      status: false,
      errors: ["loadId or status cannot be blank"]
    });
    await next();
    return;
  }
  try {
 
    const loadPromise = await db.Load.update(
      { status: status },
      { where: { id: loadId } }
    );

    if (loadPromise) {
      ctx = ctxHelpter.setResponse(ctx, HttpStatus.OK, { status: true });
      await next();
    }
  } catch (err) {
    console.log(err);
    ctx.status = ctx = ctxHelpter.setResponse(
      ctx,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { status: false, errors: ["Internal Server error", ,] }
    );
  }
});

module.exports = router;
