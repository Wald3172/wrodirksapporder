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

            if (conn) conn.end();

            if (!result) {
                next();
            }

            req.user = result[0].user;
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