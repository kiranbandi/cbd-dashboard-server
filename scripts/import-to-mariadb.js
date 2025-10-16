const fs = require('fs');
const path = require('path');
const { sequelize, User, Record, Narrative, TaskList } = require('../helpers/mariadb');

async function importToMariaDB() {
    try {
        console.log('Starting data import to MariaDB...');
        
        const exportsDir = path.join(__dirname, '..', 'exports');
        
        // Check if exports directory exists
        if (!fs.existsSync(exportsDir)) {
            throw new Error('Exports directory not found. Please run export-mongodb-data.js first.');
        }
        
        // Initialize MariaDB tables
        await sequelize.sync({ force: false });
        console.log('MariaDB tables initialized');
        
        // Import Users
        console.log('Importing users...');
        const usersData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'users.json'), 'utf8'));
        for (const user of usersData) {
            try {
                await User.create({
                    username: user.username,
                    program: user.program,
                    email: user.email,
                    fullname: user.fullname,
                    accessType: user.accessType,
                    accessList: user.accessList,
                    createdDate: user.createdDate,
                    uploadedData: user.uploadedData,
                    currentPhase: user.currentPhase,
                    promotedDate: user.promotedDate,
                    programStartDate: user.programStartDate,
                    rotationSchedule: user.rotationSchedule,
                    longitudinalSchedule: user.longitudinalSchedule,
                    citeExamScore: user.citeExamScore,
                    oralExamScore: user.oralExamScore,
                    completionStatus: user.completionStatus,
                    ccFeedbackList: user.ccFeedbackList,
                    isGraduated: user.isGraduated
                });
            } catch (error) {
                console.error(`Error importing user ${user.username}:`, error.message);
            }
        }
        console.log(`Imported ${usersData.length} users`);
        
        // Import Records
        console.log('Importing records...');
        const recordsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'records.json'), 'utf8'));
        for (const record of recordsData) {
            try {
                await Record.create({
                    username: record.username,
                    program: record.program,
                    observation_date: record.observation_date,
                    year_tag: record.year_tag,
                    epa: record.epa,
                    feedback: record.feedback,
                    observer_name: record.observer_name,
                    observer_type: record.observer_type,
                    professionalism_safety: record.professionalism_safety,
                    rating: record.rating,
                    resident_name: record.resident_name,
                    situation_context: record.situation_context,
                    type: record.type,
                    isExpired: record.isExpired,
                    phaseTag: record.phaseTag,
                    rotationTag: record.rotationTag
                });
            } catch (error) {
                console.error(`Error importing record for ${record.username}:`, error.message);
            }
        }
        console.log(`Imported ${recordsData.length} records`);
        
        // Import Narratives
        console.log('Importing narratives...');
        const narrativesData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'narratives.json'), 'utf8'));
        for (const narrative of narrativesData) {
            try {
                await Narrative.create({
                    username: narrative.username,
                    program: narrative.program,
                    resident_name: narrative.resident_name,
                    observer_name: narrative.observer_name,
                    observer_type: narrative.observer_type,
                    feedback: narrative.feedback,
                    professionalism_safety: narrative.professionalism_safety,
                    observation_date: narrative.observation_date,
                    completion_date: narrative.completion_date,
                    year_tag: narrative.year_tag
                });
            } catch (error) {
                console.error(`Error importing narrative for ${narrative.username}:`, error.message);
            }
        }
        console.log(`Imported ${narrativesData.length} narratives`);
        
        // Import Task Lists
        console.log('Importing task lists...');
        const taskListsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'tasklists.json'), 'utf8'));
        for (const taskList of taskListsData) {
            try {
                await TaskList.create({
                    username: taskList.username,
                    program: taskList.program,
                    taskList: taskList.taskList
                });
            } catch (error) {
                console.error(`Error importing task list for ${taskList.username}:`, error.message);
            }
        }
        console.log(`Imported ${taskListsData.length} task lists`);
        
        console.log('Import completed successfully!');
        
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await sequelize.close();
    }
}

// Run if called directly
if (require.main === module) {
    importToMariaDB();
}

module.exports = importToMariaDB;
