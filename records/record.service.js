const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    createMultiple
};

async function getRecordByUserName(username) {
    return await Record.find({ username });
}

async function createMultiple(recordsList) {
    //  There will always be less than 500 records so its okay to spin parallel inserts
    return await Record.collection.insert(recordsList);
}