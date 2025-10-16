const { sequelize } = require('../helpers/mariadb');

async function fixColumnSizes() {
    try {
        console.log('Fixing column sizes for longer text fields...');
        
        // Alter the records table to change professionalism_safety to TEXT
        await sequelize.query(`
            ALTER TABLE records 
            MODIFY COLUMN professionalism_safety TEXT
        `);
        console.log('✅ Updated records.professionalism_safety to TEXT');
        
        // Alter the narratives table to change professionalism_safety to TEXT
        await sequelize.query(`
            ALTER TABLE narratives 
            MODIFY COLUMN professionalism_safety TEXT
        `);
        console.log('✅ Updated narratives.professionalism_safety to TEXT');
        
        console.log('Column size fixes completed successfully!');
        
    } catch (error) {
        console.error('Error fixing column sizes:', error);
    } finally {
        await sequelize.close();
    }
}

// Run if called directly
if (require.main === module) {
    fixColumnSizes();
}

module.exports = fixColumnSizes;
