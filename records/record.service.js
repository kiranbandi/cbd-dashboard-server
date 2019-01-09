const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    create
};

async function getRecordByUserName(username) {
    return await Record.find({ username });
}

async function create(recordData) {
    // create a new user
    const record = new Record(recordData);
    // save user
    await record.save();
}