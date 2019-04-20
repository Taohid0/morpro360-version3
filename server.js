const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const serve = require("koa-static");
const mount = require("koa-mount");
const passport = require('koa-passport');
const cors = require('koa-cors');
const checkUserMiddleware = require("./middleware/checkUserMiddleware");
const checkAdminMiddleware = require("./middleware/checkAdminMiddleware");
const cronJobs = require("./utils/cronJobs");

app = new Koa();

const static_pages = new Koa();
static_pages.use(serve(__dirname + "/morpro360-frontend/build"));
app.use(mount("/", static_pages));

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3000;
var db = require("./models");

const userRouter = require("./router/user");
const authRouter = require('./router/Auth/auth');
const oauthRouter = require('./router/Auth/signUpWithGmail');
const loadRouter = require("./router/load");
const driverRouter = require("./router/driver");
const bidRouter = require("./router/bid");
const adminRouter = require("./router/admin");
const roleRouter = require("./router/role");

app.use(BodyParser());
app.use(Logger());
app.use(cors());
//need to ask masnun vai
app.use(checkUserMiddleware);
app.use(checkAdminMiddleware);

app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(oauthRouter.routes()).use(oauthRouter.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(loadRouter.routes()).use(loadRouter.allowedMethods());
app.use(driverRouter.routes()).use(driverRouter.allowedMethods());
app.use(bidRouter.routes()).use(bidRouter.allowedMethods());
app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
app.use(roleRouter.routes()).use(roleRouter.allowedMethods());



//cron jobs
cronJobs.deleteExpiredTokensCronJob();


// Syncing our database and logging a message to the user upon success
// db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
// });