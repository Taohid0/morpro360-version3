const cron = require("node-cron");
const tokenUtil = require("./token");

function deleteExpiredTokensCronJob() {
  cron.schedule("* * 23 * * *", () => {
    let result = tokenUtil.deleteExpiredTokens();
    if (!result) {
      console.log(result);
    }
    else{
      console.log("cron job done for expired token deletion");
    }
  });
}

module.exports = {
  deleteExpiredTokensCronJob
};
