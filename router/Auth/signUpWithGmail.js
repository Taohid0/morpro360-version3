const db = require("../../models");
const Router = require("koa-router");
const bcrypt = require("bcrypt-nodejs");
const HttpStatus = require("http-status-codes");
const passport = require('koa-passport');
const userUtils = require("../../utils/user");

const router = new Router({
    prefix:"/oauth"
});

const fetchUser = (() => {
    // This is an example! Use password hashing in your project and avoid storing passwords in your code
    const user = { id: 1, username: 'test', password: 'test' }
    return async function() {
      return user
    }
  })()
  
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })
  
const GoogleStrategy = require('passport-google-auth').Strategy
passport.use(new GoogleStrategy({
    clientId: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
))

router.post("/signup-with-gmail", async (ctx,next)=>{
    console.log(ctx.request.body);
    ctx.status = 200;
})

module.exports = router;