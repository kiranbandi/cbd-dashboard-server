const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.MariaDbConfig);

const User = sequelize.define('User', {
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
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessList: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    uploadedData: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    currentPhase: {
        type: DataTypes.STRING,
        allowNull: true
    },
    promotedDate: {
        type: DataTypes.JSON,
        allowNull: true
    },
    programStartDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    rotationSchedule: {
        type: DataTypes.JSON,
        allowNull: true
    },
    longitudinalSchedule: {
        type: DataTypes.JSON,
        allowNull: true
    },
    citeExamScore: {
        type: DataTypes.JSON,
        allowNull: true
    },
    oralExamScore: {
        type: DataTypes.JSON,
        allowNull: true
    },
    completionStatus: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ccFeedbackList: {
        type: DataTypes.JSON,
        allowNull: true
    },
    isGraduated: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['username', 'program']
        }
    ]
});

module.exports = User;