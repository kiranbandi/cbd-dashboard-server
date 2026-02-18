# CBD Dashboard Server

A Node.js REST API backend for the EM CBME (Emergency Medicine Competency-Based Medical Education) Dashboard. This server provides endpoints for managing user authentication, medical records, narratives, and task tracking.

## Overview

The CBD Dashboard Server is built with Express.js and provides a comprehensive API for managing:
- **User Management**: Authentication, JWT-based authorization, and user roles
- **Records**: Medical education records and performance data
- **Narratives**: Documentation and narrative entries
- **Tasks**: Task management and tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Databases**: 
  - MariaDB
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Logging**: Winston + Morgan
- **Security**: bcryptjs for password hashing

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- MariaDB server running
- Environment variables configured

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```bash
cp .env.example .env
```

Set these values in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DATABASE=ugme_epa_dashboard
DB_USERNAME=your-username
DB_PASSWORD=your-password
KEY=your-jwt-secret-key
CORS_ORIGINS="https://localhost.usask.ca:8080,https://medmedicdev.usask.ca"
WEB_URL="https://localhost.usask.ca:8080"
# alternate web url for dev server https://medmedicdev.usask.ca/epa-dashboard
PAWS_VALIDATE_URL="https://cas.usask.ca/cas/serviceValidate"
```
## Running the Server

### Development Mode
Starts the server with hot reload and debugging enabled:
```bash
npm start
```

With debugger break on startup:
```bash
npm run start-break
```

### Production Mode
```bash
npm run prod
```

### Production Docker Mode
```bash
npm run prod-docker
```
The server runs on port 80 in Docker, port 8001 otherwise.

## API Endpoints

### Base URL
- Local: `http://localhost:8001`
- Dev Server: `https://medmedicdev.usask.ca/epa-dashboard`

### Main Routes

- **`/users`** - User authentication and management
- **`/records`** - Medical records management
- **`/narratives`** - Narrative documentation
- **`/tasks`** - Task tracking and management

All endpoints (except authentication) require a valid JWT token in the `Authorization` header.

## Project Structure

```
cbd-dashboard-server/
├── app.js                    # Express app configuration
├── config.js                 # Configuration and environment variables
├── helpers/                  # Utility functions
│   ├── db.js                # Database utilities
│   ├── errorHandler.js      # Error handling middleware
│   ├── jwt.js               # JWT authentication middleware
│   ├── mariadb.js           # MariaDB connection setup
│   ├── validateTicket.js    # Ticket validation logic
│   └── winston.js           # Logging configuration
├── users/                    # User module
│   ├── user.controller.js   # Request handlers
│   ├── user.model.js        # Data model
│   └── user.service.js      # Business logic
├── records/                  # Records module
│   ├── record.controller.js
│   ├── record.model.js
│   └── record.service.js
├── narratives/              # Narratives module
│   ├── narrative.controller.js
│   ├── narrative.model.js
│   └── narrative.service.js
├── tasks/                    # Tasks module
   ├── task.controller.js
   ├── task.model.js
   └── task.service.js

```

## Authentication

The server uses JWT (JSON Web Tokens) for API authentication:

1. Obtain a token via the `/users/login` endpoint
2. Include the token in the `Authorization` header: `Authorization: Bearer <token>`
3. JWT middleware validates tokens for all protected routes

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured in `config.js` and can be overridden with `CORS_ORIGINS` in `.env` (comma-separated values). Only requests from allowed origins receive CORS headers.

## Error Handling

Errors are handled centrally through the `errorHandler` middleware. Errors are logged using Winston and returned with appropriate HTTP status codes.

## Logging

- **Morgan**: HTTP request logging
- **Winston**: Application-level logging with file and console transports
- Logs are available in the `logs/` directory

## Docker

A Dockerfile is included for containerized deployment:
```bash
docker build -t cbd-dashboard-server .
docker run -p 80:80 cbd-dashboard-server
```

## License

MIT

## Author

kiranbandi
