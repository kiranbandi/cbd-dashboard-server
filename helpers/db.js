const config = require('../config');
const mongoose = require('mongoose');

mongoose.connect(config.DbConnectionString);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};