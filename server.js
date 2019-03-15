const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const Logger = require("koa-logger");

app = new Koa();
const router = new Router();

app.use(BodyParser());
app.use(Logger());

router.get("/",async function(ctx){
    ctx.body = "hello";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001)