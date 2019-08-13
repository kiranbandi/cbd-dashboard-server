const config = require('../config');
const mongoose = require('mongoose');

mongoose.connect(config.DbConnectionString);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Record: require('../records/record.model'),
    Narrative: require('../narratives/narrative.model'),
};