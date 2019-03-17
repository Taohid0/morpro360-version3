const md5 = require('md5');

function getHash(email){
    const currentTime = String(Date());
    const randomNumber = String(Math.random());
    const originalString = email+currentTime+randomNumber;

    const hashString = md5(originalString);
    console.log(hashString);
    return hashString;

}
module.exports={
    getHash
}