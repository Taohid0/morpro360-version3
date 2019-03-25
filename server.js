const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const passport = require('koa-passport');
const cors = require('koa-cors');

app = new Koa();

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3000;
var db = require("./models");

const userRouter = require("./router/user.js");
const authRouter = require('./router/Auth/auth');
const companyRouter = require('./router/company');
const oauthRouter = require('./router/Auth/signUpWithGmail');

app.use(BodyParser());
app.use(Logger());
app.use(cors());

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(companyRouter.routes()).use(companyRouter.allowedMethods());
app.use(oauthRouter.routes()).use(oauthRouter.allowedMethods());

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });