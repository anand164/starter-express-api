var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path')
require('dotenv').config()
console.log({
    user: process.env.EMAIL_ID, // generated ethereal user
    pass: process.env.EMAIL_PASS // generated ethereal password
    });
let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587, //587
    secure: false, // true for 465, false for other ports
    auth: {
    user: process.env.EMAIL_ID, // generated ethereal user
    pass: process.env.EMAIL_PASS // generated ethereal password
    }
  })
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            callback(err);
        } else {
            callback(null, html);
        }
    });
};
/**
 * create email template and send mail.
 * @param { , userName, email, purpose, subject, url} emailData 
 * @param { , error, sentInfo } callback 
 */
var mailForm = function(emailData,callback){
    let filePath;
    if(emailData.subject1 == "Accept") filePath = "../templates/invitation.ejs";
    else filePath = "../templates/email.ejs"
    var templateDir = path.join(__dirname,filePath)
    readHTMLFile(templateDir, function(err, html) {
        if(err){
            console.log('can not read html file , Error =>',err);
            callback(err);
        } 
        else{
        var template = handlebars.compile(html);
        var replacements = {
             userName: emailData.userName,
             subject1:emailData.subject1,
             subject2:emailData.subject2,
             purpose:emailData.purpose,
             url:emailData.url
            };
        var htmlToSend = template(replacements);
        // console.log('htmlToSend',htmlToSend);
        let mailOptions = {
            from: '"Chat App" <anand.ap2020@gmail.com>', // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: htmlToSend // html body
            };
          sendMail(mailOptions,callback)
        }
    })
}
var forgetMailForm = function(emailData,callback){  //userName,email,purpose,subject,url
    var templateDir = path.join(__dirname,'../templates/email.ejs')
    readHTMLFile(templateDir, function(err, html) {
        if(err){
            console.log('can not read html file , Error =>',err);
            callback(err)
        } 
        else {
        var template = handlebars.compile(html);
        var replacements = {
             userName: emailData.userName,
             subject:emailData.subject,
             purpose:emailData.purpose,
             url:emailData.url
            };
        var htmlToSend = template(replacements);
        // console.log('htmlToSend',htmlToSend);
        let mailOptions = {
            from: '"HR Management 👻" <anand.ap2020@gmail.com>', // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: htmlToSend // html body
            };
          sendMail(mailOptions,callback)
        }
    })
}
function getAttachments(attachments){
   let  mayAttachments=[]
    attachments.forEach(attachment => {
        mayAttachments.push({
            filename: attachment.uploadInfo.fileName,
            path: attachment.uploadInfo.link
        })
    });
    // console.log('mayAttachments',mayAttachments);
    
    return mayAttachments;
}
var leaveForm = function(leaveData,callback){ 
    let fullLeaveType={
        "SICK_LEAVE":"Sick Leave",
        "CASUAL_LEAVE":"Casual Leave",
        "LONG_LEAVE":"Long Leave",
      };
    let mailOptions = {
        from: '"Leave Request by '+leaveData.userName+'👻" <anand.ap2020@gmail.com>', // sender address
        to: leaveData.email, // list of receivers
        subject: fullLeaveType[leaveData.subject], // Subject line
        html: leaveData.content, // html body
        attachments:getAttachments(leaveData.attachments)
        };
      sendMail(mailOptions,callback)
}
function sendMail(mailOptions,callback){
    transporter.sendMail(mailOptions).then(info=>{
        console.log("Message sent: %s", info.messageId);
        callback(null,info)
      }).catch(err=>{
          console.log('failed fo send Email',err)
          callback(err);
      })
}
module.exports = {mailForm, leaveForm, forgetMailForm};
