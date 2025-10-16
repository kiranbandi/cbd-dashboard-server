const db = require('../helpers/mariadb');
const { Op } = require('sequelize');
const Record = db.Record;

module.exports = {
    getRecordByUserName,
    createMultiple,
    deleteRecords,
    deleteUGRecords,
    getAllRecords,
    getRecordsByYear,
    getUGRecordsByYear,
    getAllObserversList,
    getRecordsByObserverName
};

async function getRecordByUserName(username, program) {
    return await Record.findAll({ where: { username, program } });
}

async function getAllRecords(program) {
    return await Record.findAll({ where: { program } });
}

async function getRecordsByYear(academicYear, programSpecific = true, program) {
    const yearTags = [academicYear + '-2', (+academicYear + 1) + '-1'];
    
    if (programSpecific) {
        return await Record.findAll({ 
            where: { 
                program, 
                year_tag: { [Op.in]: yearTags } 
            } 
        });
    }
    // if the query isnt specific to a program then just return all records matching the academic year
    else {
        return await Record.findAll({ 
            where: { 
                year_tag: { [Op.in]: yearTags } 
            } 
        });
    }
}

async function getUGRecordsByYear(year_tag, program = 'UNDERGRADUATE') {
    return await Record.findAll({ where: { program, year_tag } });
}

async function createMultiple(recordsList) {
    return await Record.bulkCreate(recordsList);
}

// for UG we have paper and 145 records that we leave untouched
async function deleteUGRecords(program, type = 'app') {
    return await Record.destroy({ where: { program, type } });
}

async function deleteRecords(username, year_tag = 'all', program) {
    //  if year tag is all then delete everything
    if (year_tag == 'all') {
        return await Record.destroy({ where: { username, program } });
    }
    // if not selectively delete records that match the given year tag 
    else {
        return await Record.destroy({ where: { username, year_tag, program } });
    }
}

async function getAllObserversList(program) {
    // Get observers and aggregate them by count using raw SQL
    const [results] = await db.sequelize.query(`
        SELECT LOWER(observer_name) as observer_name, COUNT(*) as count
        FROM records 
        WHERE program = :program
        GROUP BY LOWER(observer_name)
    `, {
        replacements: { program },
        type: db.sequelize.QueryTypes.SELECT
    });
    
    // Convert to the expected format
    const observerCounts = {};
    results.forEach(row => {
        observerCounts[row.observer_name] = row.count;
    });
    
    return [observerCounts];
}

async function getRecordsByObserverName(observer_name, program) {
    return await Record.findAll({ 
        where: { 
            program, 
            observer_name: { [Op.like]: observer_name } 
        } 
    });
}