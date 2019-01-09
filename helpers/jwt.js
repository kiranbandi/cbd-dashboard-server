const expressJwt = require('express-jwt');
const config = require('../config');

module.exports = jwt;

function jwt() {
    const secret = config.key;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate'
        ]
    });
}