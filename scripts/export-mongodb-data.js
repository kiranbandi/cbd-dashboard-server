const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const config = require('../config');

async function exportMongoDBData() {
    let mongoClient;
    
    try {
        console.log('Starting MongoDB data export...');
        
        // Connect to MongoDB
        mongoClient = new MongoClient(config.DbConnectionString);
        await mongoClient.connect();
        const db = mongoClient.db('rcm-cbd');
        
        // Create exports directory
        const exportsDir = path.join(__dirname, '..', 'exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }
        
        // Export Users
        console.log('Exporting users...');
        const users = await db.collection('users').find({}).toArray();
        fs.writeFileSync(
            path.join(exportsDir, 'users.json'), 
            JSON.stringify(users, null, 2)
        );
        console.log(`Exported ${users.length} users to exports/users.json`);
        
        // Export Records
        console.log('Exporting records...');
        const records = await db.collection('records').find({}).toArray();
        fs.writeFileSync(
            path.join(exportsDir, 'records.json'), 
            JSON.stringify(records, null, 2)
        );
        console.log(`Exported ${records.length} records to exports/records.json`);
        
        // Export Narratives
        console.log('Exporting narratives...');
        const narratives = await db.collection('narratives').find({}).toArray();
        fs.writeFileSync(
            path.join(exportsDir, 'narratives.json'), 
            JSON.stringify(narratives, null, 2)
        );
        console.log(`Exported ${narratives.length} narratives to exports/narratives.json`);
        
        // Export Task Lists
        console.log('Exporting task lists...');
        const taskLists = await db.collection('tasklists').find({}).toArray();
        fs.writeFileSync(
            path.join(exportsDir, 'tasklists.json'), 
            JSON.stringify(taskLists, null, 2)
        );
        console.log(`Exported ${taskLists.length} task lists to exports/tasklists.json`);
        
        // Create summary
        const summary = {
            exportDate: new Date().toISOString(),
            collections: {
                users: users.length,
                records: records.length,
                narratives: narratives.length,
                tasklists: taskLists.length
            },
            totalRecords: users.length + records.length + narratives.length + taskLists.length
        };
        
        fs.writeFileSync(
            path.join(exportsDir, 'export-summary.json'), 
            JSON.stringify(summary, null, 2)
        );
        
        console.log('Export completed successfully!');
        console.log(`Total records exported: ${summary.totalRecords}`);
        console.log(`Export files saved to: ${exportsDir}`);
        
    } catch (error) {
        console.error('Export failed:', error);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}

// Run if called directly
if (require.main === module) {
    exportMongoDBData();
}

module.exports = exportMongoDBData;
