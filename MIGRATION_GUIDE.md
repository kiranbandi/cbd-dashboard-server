# MongoDB to MariaDB Migration Guide

This guide will help you migrate your CBD Dashboard Server from MongoDB to MariaDB.

## Prerequisites

1. **MariaDB/MySQL Server**: Install MariaDB or MySQL server
2. **Node.js Dependencies**: Install the new dependencies
3. **Database Access**: Ensure you have access to both MongoDB and MariaDB

## Step 1: Install Dependencies

```bash
npm install
```

This will install the new MariaDB dependencies (mysql2, sequelize) and keep MongoDB for migration purposes.

## Step 2: Configure MariaDB Connection

Update the `config.js` file with your MariaDB connection details:

```javascript
MariaDbConfig: {
  host: 'localhost',        // Your MariaDB host
  port: 3306,              // Your MariaDB port
  database: 'rcm_cbd',     // Your database name
  username: 'your_username', // Your MariaDB username
  password: 'your_password', // Your MariaDB password
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
```

## Step 3: Create MariaDB Database

1. Connect to your MariaDB server
2. Create the database:

```sql
CREATE DATABASE rcm_cbd;
```

## Step 4: Initialize MariaDB Tables

Run the database initialization script:

```bash
npm run init-db
```

This will create all the necessary tables in MariaDB.

## Step 5: Migrate Data from MongoDB

Run the migration script to transfer all data from MongoDB to MariaDB:

```bash
npm run migrate
```

This script will:
- Connect to your MongoDB database
- Connect to your MariaDB database
- Transfer all users, records, narratives, and task lists
- Handle data type conversions appropriately

## Step 6: Verify Migration

After migration, verify that:
1. All tables are created in MariaDB
2. Data has been transferred correctly
3. The application starts without errors

## Step 7: Test the Application

Start the application and test all functionality:

```bash
npm start
```

## Database Schema

The following tables will be created:

### users
- id (Primary Key, Auto Increment)
- username (String, Not Null)
- program (String, Not Null)
- email (String, Not Null)
- fullname (String, Not Null)
- accessType (String, Not Null)
- accessList (Text, Nullable)
- createdDate (DateTime)
- uploadedData (DateTime)
- currentPhase (String, Nullable)
- promotedDate (JSON, Nullable)
- programStartDate (DateTime)
- rotationSchedule (JSON, Nullable)
- longitudinalSchedule (JSON, Nullable)
- citeExamScore (JSON, Nullable)
- oralExamScore (JSON, Nullable)
- completionStatus (JSON, Nullable)
- ccFeedbackList (JSON, Nullable)
- isGraduated (Boolean, Nullable)

### records
- id (Primary Key, Auto Increment)
- username (String, Not Null)
- program (String, Not Null)
- observation_date (String, Not Null)
- year_tag (String, Not Null)
- epa (String, Not Null)
- feedback (Text, Nullable)
- observer_name (String, Not Null)
- observer_type (String, Nullable)
- professionalism_safety (String, Nullable)
- rating (String, Nullable)
- resident_name (String, Not Null)
- situation_context (Text, Nullable)
- type (String, Nullable)
- isExpired (Boolean, Nullable)
- phaseTag (String, Nullable)
- rotationTag (String, Nullable)

### narratives
- id (Primary Key, Auto Increment)
- username (String, Not Null)
- program (String, Not Null)
- resident_name (String, Not Null)
- observer_name (String, Not Null)
- observer_type (String, Nullable)
- feedback (Text, Nullable)
- professionalism_safety (String, Nullable)
- observation_date (String, Not Null)
- completion_date (String, Not Null)
- year_tag (String, Not Null)

### task_lists
- id (Primary Key, Auto Increment)
- username (String, Not Null)
- program (String, Not Null)
- taskList (JSON, Nullable)

## Data Export/Import Scripts

### Export from MongoDB

If you need to export data from MongoDB manually:

```bash
# Export users
mongoexport --db rcm-cbd --collection users --out users.json

# Export records
mongoexport --db rcm-cbd --collection records --out records.json

# Export narratives
mongoexport --db rcm-cbd --collection narratives --out narratives.json

# Export task lists
mongoexport --db rcm-cbd --collection tasklists --out tasklists.json
```

### Import to MariaDB

The migration script handles the import automatically, but you can also use MySQL's import tools if needed.

## Troubleshooting

### Common Issues

1. **Connection Issues**: Ensure MariaDB is running and credentials are correct
2. **Permission Issues**: Ensure the MariaDB user has CREATE, INSERT, UPDATE, DELETE permissions
3. **Data Type Issues**: The migration script handles most conversions, but check for any data that doesn't fit the new schema

### Rollback Plan

If you need to rollback to MongoDB:
1. Keep your original MongoDB data intact
2. Revert the `helpers/db.js` file to use MongoDB
3. Reinstall MongoDB dependencies if removed
4. Restart the application

## Performance Considerations

- MariaDB with proper indexing should provide similar or better performance than MongoDB
- The new schema includes appropriate indexes for common queries
- Consider adding additional indexes based on your specific query patterns

## Support

If you encounter issues during migration, check:
1. MariaDB server logs
2. Application logs
3. Database connection status
4. Data integrity after migration
