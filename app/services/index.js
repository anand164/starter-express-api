const cryptoServices = require('./crypto')
const emailService = require('./email-service')
const BASE_URL= require('../config').BASE_URL;
let sendMail = (user, aStatus, isInvitation) =>{
    return new Promise((res, rej)=>{
        let enc_Astatus, encDate, encToken, eaccType, purpose,subject, subject1,subject2="";
        eaccType = cryptoServices.encrypt(user.accType);
        encDate = getEncEmailTime()
        if(isInvitation){
            subject = "Contact Invitation"
            subject1 = "Accept";
            subject2 = "Reject";
            enc_Astatus= cryptoServices.encrypt("true");
            purpose ="We've received your Email Verification request. Please, click the following button to Verify mail:";
        }
        else if(aStatus){
            subject = subject1 = "Email Verification";
            enc_Astatus= cryptoServices.encrypt("true");
            purpose ="We've received your Email Verification request. Please, click the following button to Verify mail:";
        } else {
            subject = subject1 = "Reset Password";
            enc_Astatus= cryptoServices.encrypt("false");
            purpose ="We've received your Email for reset password request. Please, click the following button to Reset Password:";
        }
        encToken = cryptoServices.encrypt(user.emailToken);
        let tokenUrl=BASE_URL+'candidate/verifymail/'+eaccType+'/'+encToken+'/'+enc_Astatus+'/'+encDate;
        emailService.mailForm({ 
        userName: user.user || user.username || user.email,
        email:user.email,
        purpose:purpose,
        subject:subject,
        subject1:subject1,
        subject2:subject2,
        url:tokenUrl
        },(err,info)=>{
        if(err) rej(err)
        else  res('EMAIL_SENT')
        })
    })
}
let getEncEmailTime =()=>{
    var myDate = new Date();
    myDate.setDate(myDate.getDate() + 1);
    myDate=myDate.toString();
    return cryptoServices.encrypt(myDate)
}
module.exports = {
    BASE_URL,
    sendMail,
    getEncEmailTime,
}