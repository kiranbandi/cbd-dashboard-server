const express = require('express');
const fs = require('fs');
const https = require('https');
var morgan = require('morgan');
var winston = require('./helpers/winston');
var jwt = require('./helpers/jwt');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/errorHandler');

// Initialise the express app
var app = express();

// Use morgan for logging Requests , combined along with log outputs from winston
app.use(morgan('combined', { stream: winston.stream }));

// Setting response headers to be used for all API endpoints
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization');
    next();
});

// Attach data from API call to request object body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Link keys that will be required for HTTPS access
const options = {
    cert: fs.readFileSync('./key/fullchain.pem'),
    key: fs.readFileSync('./key/privkey.pem')
}

// Server for production site
https.createServer(options, app).listen(8081, function() { winston.info("Server Live on Port 8081") })
    // Server for local access during development and testing
    // app.listen(8081, () => { winston.info("Server Live on Port 8081") });

// use JWT auth to secure the api
app.use(jwt());

// api routes for authentication and user related APIs
app.use('/users', require('./users/user.controller'));

// api routes for record and data fetching APIs
app.use('/records', require('./records/record.controller'));

// global error handler
app.use(errorHandler);