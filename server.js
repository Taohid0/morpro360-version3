const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const passport = require('koa-passport');
const cors = require('koa-cors');
const checkUserMiddleware = require("./middleware/checkUserMiddleware");
app = new Koa();

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3001;
var db = require("./models");

const userRouter = require("./router/user");
const authRouter = require('./router/Auth/auth');
const companyRouter = require('./router/company');
const oauthRouter = require('./router/Auth/signUpWithGmail');
const loadRouter = require("./router/load");
const driverRouter = require("./router/driver");
const bidRouter = require("./router/bid");

app.use(BodyParser());
app.use(Logger());
app.use(cors());
//need to ask masnun vai
app.use(checkUserMiddleware);

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(companyRouter.routes()).use(companyRouter.allowedMethods());
app.use(oauthRouter.routes()).use(oauthRouter.allowedMethods());
app.use(loadRouter.routes()).use(loadRouter.allowedMethods());
app.use(driverRouter.routes()).use(driverRouter.allowedMethods());
app.use(bidRouter.routes()).use(bidRouter.allowedMethods());

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });