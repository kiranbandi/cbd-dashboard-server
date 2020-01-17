const db = require('../helpers/db');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    createMultiple,
    deleteRecords,
    deleteUGRecords,
    getAllRecords,
    getAllObserversList,
    getRecordsByObserverName
};

async function getRecordByUserName(username, program) {
    return await Record.find({ username, program });
}

async function getAllRecords(program) {
    return await Record.find({ program });
}

async function createMultiple(recordsList) {
    return await Record.collection.insertMany(recordsList);
}


async function deleteRecords(username, year_tag = 'all') {

    // for UG we multiplex the year tag along with the type tag
    // so we can selectively delete all records from a single cohort that had their data
    // from the APP or the 145 system or paper based

    //  if year tag is all then delete everything
    if (year_tag == 'all') {
        return await Record.deleteMany({ username });
    }
    // if not selectively delete records that match the given year tag 
    else {
        return await Record.deleteMany({ username, year_tag });
    }
}

async function getAllObserversList(program) {
    // get observers and aggregate them by count
    return Record.aggregate([
        { "$match": { "program": program } },
        {
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

async function getRecordsByObserverName(observer_name, program) {
    return await Record.find({ program, observer_name: new RegExp('^' + observer_name + '$', 'i') });
}