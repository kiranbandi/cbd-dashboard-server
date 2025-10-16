const { sequelize, User, Record, Narrative, TaskList } = require('../helpers/mariadb');

async function initializeDatabase() {
    try {
        console.log('Initializing MariaDB database...');
        
        // Sync all models (create tables)
        await sequelize.sync({ force: false }); // Set to true to drop existing tables
        
        console.log('Database tables created successfully!');
        console.log('Tables created:');
        console.log('- users');
        console.log('- records');
        console.log('- narratives');
        console.log('- task_lists');
        
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;
