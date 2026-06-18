const mysql = require('mysql2/promise');
const fs = require('fs');

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA)
    }
});

module.exports = pool;