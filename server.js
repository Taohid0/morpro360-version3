const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

app = new Koa();
const router = new Router();

app.use(BodyParser());
app.use(Logger());

router.get("/",async function(ctx){
    ctx.body = "hello";
});

app.use(router.routes()).use(router.allowedMethods());

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
  });
app.listen(3001)