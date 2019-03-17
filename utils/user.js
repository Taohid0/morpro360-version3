const md5 = require('md5');

function getHash(email){
    const currentTime = String(Date());
    const randomNumber = String(Math.random());
    const originalString = email+currentTime+randomNumber;

    console.log(originalString);
    const hashString = md5(originalString);
    return hashString;

}
module.exports={
    getHash
}