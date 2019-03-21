const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");
const passport = require('koa-passport');
const cors = require('koa-cors');

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3000;
var db = require("./models");

const userRoutes = require("./router/user.js");
const authRoutes = require('./router/auth');

app = new Koa();

app.use(BodyParser());
app.use(Logger());
app.use(cors());

app.use(userRoutes.routes());
app.use(authRoutes.routes());

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });