const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3000;
var db = require("./models");

const userRoutes = require("./router/user.js");

app = new Koa();

app.use(BodyParser());
app.use(Logger());

app.use(userRoutes.routes());


// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });