const { MongoClient } = require('mongodb');
const { sequelize, Record, Narrative } = require('../helpers/mariadb');
const config = require('../config');

async function remigrateTruncatedRecords() {
    let mongoClient;
    
    try {
        console.log('Re-migrating records with truncated data...');
        
        // Connect to MongoDB
        mongoClient = new MongoClient(config.DbConnectionString);
        await mongoClient.connect();
        const db = mongoClient.db('rcm-cbd');
        
        // Get all records from MongoDB
        const records = await db.collection('records').find({}).toArray();
        console.log(`Found ${records.length} records in MongoDB`);
        
        // Clear existing records in MariaDB
        await Record.destroy({ where: {} });
        console.log('Cleared existing records from MariaDB');
        
        // Re-migrate all records with the fixed schema
        let migratedCount = 0;
        let errorCount = 0;
        
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
                migratedCount++;
            } catch (error) {
                console.error(`Error migrating record for ${record.username}:`, error.message);
                errorCount++;
            }
        }
        
        console.log(`✅ Re-migrated ${migratedCount} records successfully`);
        if (errorCount > 0) {
            console.log(`⚠️  ${errorCount} records had errors`);
        }
        
        // Now do the same for narratives
        const narratives = await db.collection('narratives').find({}).toArray();
        console.log(`Found ${narratives.length} narratives in MongoDB`);
        
        // Clear existing narratives in MariaDB
        await Narrative.destroy({ where: {} });
        console.log('Cleared existing narratives from MariaDB');
        
        // Re-migrate all narratives
        let narrativeMigratedCount = 0;
        let narrativeErrorCount = 0;
        
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
                narrativeMigratedCount++;
            } catch (error) {
                console.error(`Error migrating narrative for ${narrative.username}:`, error.message);
                narrativeErrorCount++;
            }
        }
        
        console.log(`✅ Re-migrated ${narrativeMigratedCount} narratives successfully`);
        if (narrativeErrorCount > 0) {
            console.log(`⚠️  ${narrativeErrorCount} narratives had errors`);
        }
        
        console.log('Re-migration completed successfully!');
        
    } catch (error) {
        console.error('Re-migration failed:', error);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
        await sequelize.close();
    }
}

// Run if called directly
if (require.main === module) {
    remigrateTruncatedRecords();
}

module.exports = remigrateTruncatedRecords;
