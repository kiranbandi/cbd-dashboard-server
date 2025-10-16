const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.MariaDbConfig);

const Narrative = sequelize.define('Narrative', {
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
    resident_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observer_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    professionalism_safety: {
        type: DataTypes.STRING,
        allowNull: true
    },
    observation_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completion_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year_tag: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'narratives',
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
        }
    ]
});

module.exports = Narrative;