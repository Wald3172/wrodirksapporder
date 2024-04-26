const poolUser = require('../../config/dbConfigUser');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");

const access = async (req, res, next) => {

    if (req.cookies.userSave) {
        try {
            // verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
            // check if the user still exist
            let conn;
            conn = await poolUser.getConnection();
            const result = await conn.query("SELECT * FROM user WHERE id = ?", [decoded.id]);
            const allUsers = await conn.query("SELECT * FROM user WHERE account_confirmed = 1")
            const unconfirmedUsers = await conn.query("SELECT * FROM user WHERE account_confirmed = 0")

            if (conn) conn.end();

            if (!result) {
                next();
            }

            req.user = result[0].user;
            if (result[0].role === 'admin') {
                req.admin = result[0].role;
            } else {
                req.admin = '';
            }
            req.allUsers = allUsers;
            req.unconfirmedUsers = unconfirmedUsers;
            if (unconfirmedUsers.length >= 10) {
                req.qtyUnconfirmedUsers = '9+'; 
            } else {
                req.qtyUnconfirmedUsers = unconfirmedUsers.length; 
            }
                
            next();

        } catch (error) {
            console.log(error);
            next();
        } 
    } else {
        next();
    }
}

module.exports = access;