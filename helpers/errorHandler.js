var logger = require('winston');

function errorHandler(err, req, res, next) {

    if (typeof(err) === 'string') {
        // custom application error
        logger.error(err);
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        logger.error("error during validation");
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        logger.error(err.message);
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }
    logger.error(err.message);
    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;