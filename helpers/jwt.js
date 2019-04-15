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

//  We currently use a HS256 , Hash based authentication
//  But this will be updated to a RS 256 Signature

//  Also the timing for the JWT to be currently active 
// should be less probably an hour for now ?