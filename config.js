require('dotenv').config();

const defaultOrigins = ["https://localhost.usask.ca:8080"];
const origins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : defaultOrigins;

module.exports = {
  origins,
  key: process.env.KEY || "eiusmod12tempor#incididunt1ut9labore.,$potter-alahamora",
  MariaDbConfig: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DATABASE || 'ugme_epa_dashboard',
    username: process.env.DB_USERNAME || 'dashboard_app',
    password: process.env.DB_PASSWORD || 'medmedicdev',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};