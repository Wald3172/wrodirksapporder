const mariadb = require('mariadb');
require('dotenv').config();

    const poolUser = mariadb.createPool({
        host: process.env.DATABASE_HOST_USER, 
        user: process.env.DATABASE_USER_USER, 
        password: process.env.DATABASE_PASSWORD_USER, 
        database: process.env.DATABASE_NAME_USER,
        connectionLimit: process.env.DATABASE_CONNECTION_LIMIT_USER
    });

module.exports = poolUser;