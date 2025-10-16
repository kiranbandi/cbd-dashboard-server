const { MongoClient } = require('mongodb');
const { sequelize, User, Record, Narrative, TaskList } = require('../helpers/mariadb');
const config = require('../config');

async function migrateData() {
    let mongoClient;
    
    try {
        console.log('Starting MongoDB to MariaDB migration...');
        
        // Connect to MongoDB
        mongoClient = new MongoClient(config.DbConnectionString);
        await mongoClient.connect();
        const db = mongoClient.db('rcm-cbd');
        
        // Initialize MariaDB tables
        await sequelize.sync({ force: false });
        
        // Migrate Users
        console.log('Migrating users...');
        const users = await db.collection('users').find({}).toArray();
        for (const user of users) {
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
                console.error(`Error migrating user ${user.username}:`, error.message);
            }
        }
        console.log(`Migrated ${users.length} users`);
        
        // Migrate Records
        console.log('Migrating records...');
        const records = await db.collection('records').find({}).toArray();
        for (const record of records) {
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
                console.error(`Error migrating record for ${record.username}:`, error.message);
            }
        }
        console.log(`Migrated ${records.length} records`);
        
        // Migrate Narratives
        console.log('Migrating narratives...');
        const narratives = await db.collection('narratives').find({}).toArray();
        for (const narrative of narratives) {
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
                console.error(`Error migrating narrative for ${narrative.username}:`, error.message);
            }
        }
        console.log(`Migrated ${narratives.length} narratives`);
        
        // Migrate TaskLists
        console.log('Migrating task lists...');
        const taskLists = await db.collection('tasklists').find({}).toArray();
        for (const taskList of taskLists) {
            try {
                await TaskList.create({
                    username: taskList.username,
                    program: taskList.program,
                    taskList: taskList.taskList
                });
            } catch (error) {
                console.error(`Error migrating task list for ${taskList.username}:`, error.message);
            }
        }
        console.log(`Migrated ${taskLists.length} task lists`);
        
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
        await sequelize.close();
    }
}

// Run if called directly
if (require.main === module) {
    migrateData();
}

module.exports = migrateData;
