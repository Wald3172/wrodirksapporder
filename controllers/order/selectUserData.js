const poolUser = require('../../config/dbConfigUser');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
require('dotenv').config();
const CryptoJS = require('crypto-js');

const selectUserData = async (req, res, next) => {

    let conn;

    if (req.cookies.userSave) {
        try {
            conn = await poolUser.getConnection();
    
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
    
            const user = await conn.query("SELECT first_name, last_name FROM user WHERE id = ?", [decoded.id]);
            const passOut = await conn.query("SELECT pass_out FROM outlook WHERE user_id = ?", [decoded.id])

            if (!passOut.length === 0) {
                const passwordOutlook = CryptoJS.enc.Base64.parse(passOut[0].pass_out).toString(CryptoJS.enc.Utf8);
                req.passOut = passwordOutlook;
            }
            
            req.user = `${user[0].first_name} ${user[0].last_name}`;
            req.firstName = user[0].first_name;
            req.lastName = user[0].last_name;
            
    
            if (conn) conn.end();
            next();
    
        } catch (error) {
            console.log(error);
            next();
        }
    } else {
        next();
    }
}

module.exports = selectUserData;