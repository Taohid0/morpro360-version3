// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3000;
var db = require("./models");


// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
      console.log("successful sync");
 
  }).catch(err=>
    console.log(err));