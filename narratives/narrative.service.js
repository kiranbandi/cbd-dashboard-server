const db = require('../helpers/db');
const Narrative = db.Narrative;

module.exports = {
    getNarrativesByUserName,
    createMultiple,
    deleteNarratives
};

async function getNarrativesByUserName(username, program) {
    return await Narrative.find({ username, program });
}


async function createMultiple(narrativesList) {
    return await Narrative.collection.insertMany(narrativesList);
}


async function deleteNarratives(username, year_tag = 'all') {
    //  if year tag is all then delete everything
    if (year_tag == 'all') {
        return await Narrative.deleteMany({ username });
    }
    // if not selectively delete narratives that match the given year tag 
    else {
        return await Narrative.deleteMany({ username, year_tag });
    }
}