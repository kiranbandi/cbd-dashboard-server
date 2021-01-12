const express = require('express');
var morgan = require('morgan');
var winston = require('./helpers/winston');
var jwt = require('./helpers/jwt');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/errorHandler');
const config = require('./config');

// Initialise the express app
var app = express();

// Use morgan for logging Requests , combined along with log outputs from winston
app.use(morgan('combined', { stream: winston.stream }));

// Setting response headers to be used for all API endpoints
app.use(function(req, res, next) {
    // cors header is set only when header is in the list of allowed origins from the config file
    if (config.origins.indexOf(req.headers.origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization');
    next();
});

// Attach data from API call to request object body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

const PORT = process.env.NODE_ENV == 'production_docker' ? 80 : 8081;

// Start the Server
app.listen(PORT, () => { winston.debug("Server Live on Port " + PORT) });

// use JWT auth to secure the api
app.use(jwt());

// api routes for authentication and user related APIs
app.use('/api/users', require('./users/user.controller'));

// api routes for record and data fetching APIs
app.use('/api/records', require('./records/record.controller'));

// api routes for narrative data fetching APIs
app.use('/api/narratives', require('./narratives/narrative.controller'));

// api routes for narrative data fetching APIs
app.use('/api/tasks', require('./tasks/task.controller'));

// global error handler
app.use(errorHandler);