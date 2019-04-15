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
    return await Record.distinct('observer_name');
}

async function getRecordsByObserverName(observer_name) {

    // Get all distinct observers and their aggregates 
    return await Record.aggregate([{
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