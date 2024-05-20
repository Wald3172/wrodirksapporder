const pool = require('../../config/dbConfig');
const poolUser = require('../../config/dbConfigUser');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");

const confirmRecordKamag = async (req, res) => {

    const { id } = req.body;

    let conn;
    let userOutlook;

    try {
        conn = await poolUser.getConnection();
        const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
        const userOut = await conn.query("SELECT first_name, last_name FROM user WHERE id = ?", [decoded.id]);
        userOutlook = `${userOut[0].first_name} ${userOut[0].last_name}`;
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.end();
    }

    try {
        conn = await pool.getConnection();
        await conn.query("UPDATE usterki_kamag SET status = 'naprawione', repair_login =? WHERE id = ?", [userOutlook, id]);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.end();
    }

    return res.redirect('/order/kamag');

}

module.exports = confirmRecordKamag;