const express = require('express');
const fs = require('fs');
const https = require('https');
var shortid = require('shortid');
var app = express();
var morgan = require('morgan');
var winston = require('./winston');
var csv = require('csvtojson');
var _ = require('lodash');
var config = require('./config');
var jwt = require('jsonwebtoken');

// Use morgan for logging Requests , combined along with log outputs from winston
app.use(morgan('combined', { stream: winston.stream }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');
    next();
});

// Link keys
const options = {
    cert: fs.readFileSync('./key/fullchain.pem'),
    key: fs.readFileSync('./key/privkey.pem')
}

var jsonData;

csv()
    .fromFile('./files/mock-data.csv')
    .then((data) => {
        jsonData = _.groupBy(data, (record) => { return record.Resident_Name });
        // Start the server once the data is read and ready to be served
        // https.createServer(options, app).listen(8081, function() { winston.info("Server Live on Port 8081") })
        app.listen(8081, () => { winston.info("Server Live on Port 8081") });
    })

app.get('/get-all-residents', verifyToken, (req, res) => {
    // Send the list of all residents read from the file
    res.end(JSON.stringify(Object.keys(jsonData)));
});

app.get('/get-resident-data', verifyToken, (req, res) => {
    // Send the data for the required resident
    const residentData = jsonData[req.query.residentName] || [];
    res.end(JSON.stringify(residentData));
});

app.get('/login', (req, res) => {
    // Temporary solution will need to replace with users data checking from DB later on
    var { username = '', password = '' } = req.query;
    if (username == 'emcbd' && password == 'emcbd') {
        // create a token
        var token = jwt.sign({ id: username }, config.key, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token });
    } else {
        res.status(401).send({ auth: false, token: null });
    }
})

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.key, function(err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}