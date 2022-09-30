var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path')

var templateDir = path.join(__dirname,'../app/templates/email.ejs')
    readHTMLFile(templateDir, function(err, html) {
        if(err){
            console.log('can not read html file , Error =>',err);
            callback(err)
        } 
        else {
        var template = handlebars.compile(html);
        var replacements = {
             userName: 'emailData.userName',
             subject:'emailData.subject',
             purpose:'emailData.purpose',
             url:'emailData.url'
            };
        var htmlToSend = template(replacements);      
        }
    })
    function readHTMLFile (path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    }