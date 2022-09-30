/**
 * This file contains code for creating a node proxy-server to avoid the CORS error
 * This file contains code for encrypting password before sending it to the server.
 * This file contains code for linkedin login service
 */
const express = require('express'); // Used for creating web server
const path = require('path'); // Used to traverse through file system
const compression = require('compression'); // Compression library for compressing response sent from the server
const app = express();


// Use the compression middleware to compress the response
app.use(compression());


/**
 * Add the deafult headers in the response
 */
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, token_type, access_token, refresh_token, expires_in, date');
    res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, token_type, access_token, refresh_token, expires_in, date');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      //respond with 200
      res.sendStatus(200);
    }
    else {
    //move on
      next();
    }
});

// Parse request body in JSON
app.use(express.json());


// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Required certificate files
// let key = fs.readFileSync('ssl/private.key'); // Replace the file name with the private key file name
// let cert = fs.readFileSync( 'ssl/primary.crt' ); // Replace the file name with the primary key file name
// let ca = fs.readFileSync( 'ssl/intermediate.crt' ); // Replace the file with the intermediate certificate file name

// Create option for https server
// let options = {
//     key: key,
//     cert: cert,
//     ca: ca
// };

// // Start https server
// https.createServer(options, app).listen(443, () => {
//     console.log(`Server listening on port ... ${443}`);
// });

// Start http server
// http.createServer(app).listen(80, () => {
//     console.log(`Server listening on port ... ${80}`);
// });

// Start the server on already defined port or 3000
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening... ${process.env.PORT || 3000}`);
});

