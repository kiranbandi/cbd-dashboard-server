const expressJwt = require('express-jwt');
const config = require('../config');

// pass in public routes that don't require authentication in the path array 
function jwt() {
    const secret = config.key;
    return expressJwt({ secret, algorithms: ['HS256'] }).unless({
        path: ['/api/users/authenticate']
    });
}

module.exports = jwt;

//  We currently use a HS256 , Hash based authentication
//  But this will be updated to a RS 256 Signature

//  Also the timing for the JWT to be currently active 
// should be less probably an hour for now ?