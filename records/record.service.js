const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    createMultiple,
    deleteRecords,
    getAllRecords,
    getAllObserversList,
    getRecordsByObserverName
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

async function getAllObserversList() {
    // get observers and aggregate them by count
    return Record.aggregate([{
            "$group": {
                "_id": { "$toLower": "$observer_name" },
                "count": { "$sum": 1 }
            }
        },
        {
            "$group": {
                "_id": null,
                "counts": {
                    "$push": { "k": "$_id", "v": "$count" }
                }
            }
        },
        {
            "$replaceRoot": {
                "newRoot": { "$arrayToObject": "$counts" }
            }
        }
    ]);
}

async function getRecordsByObserverName(observer_name) {
    return await Record.find({ observer_name: new RegExp('^' + observer_name + '$/i') });
}