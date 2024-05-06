const poolUser = require('../../config/dbConfigUser');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
require('dotenv').config();
const CryptoJS = require('crypto-js');

const saveUserOutPass = async (req, res) => {
    
    const { passOut } = req.body;
    const pass = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(passOut));

    const title = 'WRO Dirks App | Konto';
    const pageHeader = "Moje konto";
    const footerDepartName = "Account settings";
    const successInfo = 'Hasło zostało zapisane!';
    const hrefRedirect = '/profileOutlook';
    
    if (req.cookies.userSave) {

        let conn;

        try {
            // verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
            
            conn = await poolUser.getConnection();

            const select = await conn.query("SELECT * FROM outlook WHERE user_id = ?", [decoded.id]);

            if (!select[0]) {
                await conn.query("INSERT INTO outlook (user_id, pass_out) VALUES (?, ?)", [decoded.id, pass]);
            } else {
                await conn.query("UPDATE outlook SET pass_out = ? WHERE user_id = ?", [pass, decoded.id]);
            }

            if (conn) conn.end();
            return res.render ('profile', {title, pageHeader, footerDepartName, successInfo, hrefRedirect})

        } catch (error) {
            console.log(error);
        }

    } else {
        console.log(error);
        const errorInfo = error;
        return res.render ('profile', {title, pageHeader, footerDepartName, errorInfo, hrefRedirect})
    }
}

module.exports = saveUserOutPass;