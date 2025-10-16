const db = require('../helpers/mariadb');
const Narrative = db.Narrative;

module.exports = {
    getNarrativesByUserName,
    createMultiple,
    deleteNarratives
};

async function getNarrativesByUserName(username, program) {
    return await Narrative.findAll({ where: { username, program } });
}

async function createMultiple(narrativesList) {
    return await Narrative.bulkCreate(narrativesList);
}

async function deleteNarratives(username, year_tag = 'all', program) {
    //  if year tag is all then delete everything
    if (year_tag == 'all') {
        return await Narrative.destroy({ where: { username, program } });
    }
    // if not selectively delete narratives that match the given year tag 
    else {
        return await Narrative.destroy({ where: { username, year_tag, program } });
    }
}