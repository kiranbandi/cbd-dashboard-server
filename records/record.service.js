const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    createMultiple,
    deleteRecords
};

async function getRecordByUserName(username) {
    return await Record.find({ username });
}

async function createMultiple(recordsList) {
    return await Record.collection.insert(recordsList);
}

async function deleteRecords(username) {
    return await Record.remove({ username });
}