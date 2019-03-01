// configuration file for loggin using winston
//  code sourced from tutorial on - https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications

const appRoot = require('app-root-path');
const logger = require('winston');
const { combine, timestamp, printf } = logger.format;

const otherOptions = {
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 50
};

var options = {
    file_activity: {
        level: 'info',
        filename: `${appRoot}/logs/server-activity.log`,
        ...otherOptions,
        format: combine(timestamp(), printf(({ message, timestamp }) => {
            return `${timestamp} : ${message}`;
        }))
    },
    debug_activity: {
        level: 'debug',
        filename: `${appRoot}/logs/server-combined.log`,
        ...otherOptions
    }
};

const file_transport_activity = new logger.transports.File(options.file_activity);
const file_transport_debug = new logger.transports.File(options.debug_activity);

logger.add(file_transport_activity);
logger.add(file_transport_debug);

logger.stream = {
    write: function(message) {
        logger.debug(message);
    },
};

module.exports = logger;