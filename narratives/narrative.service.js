const db = require('../helpers/db');
const Narrative = db.Narrative;

module.exports = {
    getNarrativesByUserName,
    createMultiple,
    deleteNarratives
};

async function getNarrativesByUserName(username) {
    return await Narrative.find({ username });
}


async function createMultiple(narrativeList) {
    return await Narrative.collection.insert(narrativeList);
}


async function deleteNarratives(username, year_tag = 'all') {
    //  if year tag is all then delete everything
    if (year_tag == 'all') {
        return await Narrative.remove({ username });
    }
    // if not selectively delete narratives that match the given year tag 
    else {
        return await Narrative.remove({ username, year_tag });
    }
}