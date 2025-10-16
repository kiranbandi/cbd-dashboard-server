const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.MariaDbConfig);

const TaskList = sequelize.define('TaskList', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    program: {
        type: DataTypes.STRING,
        allowNull: false
    },
    taskList: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'task_lists',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['username', 'program']
        }
    ]
});

module.exports = TaskList;