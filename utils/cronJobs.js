const cron = require("node-cron");
const tokenUtil = require("./token");

function deleteExpiredTokensCronJob() {
  cron.schedule("* * 23 * * *", () => {
    console.log("running every minute 1, 2, 4 and 5");
    let result = tokenUtil.deleteExpiredTokens();
    if (!result) {
      console.log(result);
    }
  });
}

module.exports = {
  deleteExpiredTokensCronJob
};
