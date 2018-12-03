// configuration file for loggin using winston
//  code sourced from tutorial on - https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications

const appRoot = require('app-root-path');
const winston = require('winston');

var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/em-cbd-server.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 50,
        colorize: false,
        timestamp: true
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message) {
        logger.info(message);
    },
};

module.exports = logger;