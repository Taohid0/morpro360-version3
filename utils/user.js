const md5 = require("md5");

const db = require("../models");

function getHash(email) {
  const currentTime = String(Date());
  const randomNumber = String(Math.random());
  const originalString = email + currentTime + randomNumber;

  console.log(originalString);
  const hashString = md5(originalString);
  return hashString;
}

async function isUserNameTaken(ctx) {
  const userName = ctx.request.body.userName;
  if (!userName) {
    return false;
  }
  try {
    const promise = await db.User.findOne({ where: { userName: userName } });
    if (promise) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  getHash,
  isUserNameTaken,
};
