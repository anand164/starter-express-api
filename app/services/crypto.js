const Cryptr = require('cryptr');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Secrate  = process.env.CRYPTO_SECRET;
const cryptr = new Cryptr(Secrate); //Secrate key
// else 
//     const cryptr = new Cryptr('D27YLJrr)dXrKf(RXh2kNRyptvmtgxv3MWpoq9TgM162lAADl'); //Secrate key
var encrypt = function(str){
    let encString = cryptr.encrypt(str);
    return encString;
}
var decrypt = function(str){
    let decString = cryptr.decrypt(str);
    return decString;
}
var comparePassword = function(candidatePassword, hash){
    return new Promise((resolve,reject)=>{
     bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
       if(err) throw err;
       resolve(isMatch);
     });
    })
   }
 var encryptPassword = function(planePassword){
   return new Promise((resolve,reject)=>{
     bcrypt.genSalt(10, (err, salt) => {
       bcrypt.hash(planePassword, salt, (err, hash) => {
         if(err) throw err;
        resolve(hash);
       });
     });	
   })
}

module.exports = {decrypt,encrypt, comparePassword,encryptPassword};
