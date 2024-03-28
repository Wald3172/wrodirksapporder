const mariadb = require('mariadb');
require('dotenv').config();

    const pool = mariadb.createPool({
        host: process.env.DATABASE_HOST, 
        user: process.env.DATABASE_USER, 
        password: process.env.DATABASE_PASSWORD, 
        database: process.env.DATABASE_NAME,
        connectionLimit: process.env.DATABASE_CONNECTION_LIMIT
    });

module.exports = pool;