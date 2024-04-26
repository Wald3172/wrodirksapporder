const poolUser = require('../../config/dbConfigUser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const changeUsers = async (req, res) => {

    const { id, user, first_name, last_name, email, role } = req.body;

    let conn;

    try {
        conn = await poolUser.getConnection();
        await conn.query("UPDATE user SET user = ?, first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?", [user, first_name, last_name, email, role, id])

        return res.redirect('/admin');
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.end();
    }

}

module.exports = changeUsers;