const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    createMultiple,
    deleteRecords,
    getAllRecords
};

async function getRecordByUserName(username) {
    return await Record.find({ username });
}

async function getAllRecords(username) {
    return await Record.find({});
}

async function createMultiple(recordsList) {
    return await Record.collection.insert(recordsList);
}

async function deleteRecords(username) {
    return await Record.remove({ username });
}