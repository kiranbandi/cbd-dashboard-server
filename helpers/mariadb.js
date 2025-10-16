const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

// Create Sequelize instance
const sequelize = new Sequelize(config.MariaDbConfig);

// Test the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('MariaDB connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to MariaDB:', error);
    }
}

// Initialize connection
testConnection();

// Define models directly here to avoid circular dependencies
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
        allowNull: true,
        get() {
            const value = this.getDataValue('promotedDate');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('promotedDate', value ? JSON.stringify(value) : null);
        }
    },
    programStartDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    rotationSchedule: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const value = this.getDataValue('rotationSchedule');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('rotationSchedule', value ? JSON.stringify(value) : null);
        }
    },
    longitudinalSchedule: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const value = this.getDataValue('longitudinalSchedule');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('longitudinalSchedule', value ? JSON.stringify(value) : null);
        }
    },
    citeExamScore: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const value = this.getDataValue('citeExamScore');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('citeExamScore', value ? JSON.stringify(value) : null);
        }
    },
    oralExamScore: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const value = this.getDataValue('oralExamScore');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('oralExamScore', value ? JSON.stringify(value) : null);
        }
    },
    completionStatus: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const value = this.getDataValue('completionStatus');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('completionStatus', value ? JSON.stringify(value) : null);
        }
    },
    ccFeedbackList: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
            const value = this.getDataValue('ccFeedbackList');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('ccFeedbackList', value ? JSON.stringify(value) : null);
        }
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
        type: DataTypes.TEXT,
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
        type: DataTypes.TEXT,
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
        allowNull: true,
        get() {
            const value = this.getDataValue('taskList');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
        },
        set(value) {
            this.setDataValue('taskList', value ? JSON.stringify(value) : null);
        }
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

module.exports = {
    sequelize,
    User,
    Record,
    Narrative,
    TaskList,
};
