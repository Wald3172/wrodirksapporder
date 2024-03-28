const mariadb = require('mariadb');
require('dotenv').config();

    const pool = mariadb.createPool({
        host: process.env.DATABASE_HOST_STANY, 
        user: process.env.DATABASE_USER_STANY, 
        password: process.env.DATABASE_PASSWORD_STANY, 
        database: process.env.DATABASE_NAME_STANY,
        connectionLimit: process.env.DATABASE_CONNECTION_LIMIT_STANY
    });

module.exports = pool;