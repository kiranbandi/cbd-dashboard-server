const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.MariaDbConfig);

const Record = sequelize.define('Record', {
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
    observation_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year_tag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    epa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observer_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    professionalism_safety: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resident_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    situation_context: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    phaseTag: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rotationTag: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'records',
    timestamps: false,
    indexes: [
        {
            fields: ['username', 'program']
        },
        {
            fields: ['program']
        },
        {
            fields: ['year_tag']
        },
        {
            fields: ['observer_name']
        }
    ]
});

module.exports = Record;