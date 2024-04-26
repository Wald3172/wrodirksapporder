const poolUser = require('../../config/dbConfigUser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const unconfirmedUsers = async (req, res) => {

    const { id, user, first_name, last_name, email } = req.body;
    const appLink = process.env.START_APP_LINK;
    let conn;

    try {
        conn = await poolUser.getConnection();
        await conn.query("UPDATE user SET user = ?, first_name = ?, last_name = ?, email = ?, account_confirmed = 1 WHERE id = ?", [user, first_name, last_name, email, id])

        let transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_AUTH_USER,
                pass: process.env.NODEMAILER_AUTH_PASSWORD + '#'
                }
        });
    
        transporter.use('compile', hbs({
            viewEngine: {
                extName: ".handlebars",
                partialsDir: path.resolve('./views/mails'),
                defaultLayout: false,
              },
            viewPath: path.resolve('./views/mails'),
            extName: ".handlebars",
        }));
        
        let mailOptions = {
            priority: 'high',
            from: process.env.NODEMAILER_AUTH_USER,
            to: email,
            subject: `WRO Dirks App - konto zostało potwierdzone`,
            template: 'confirmMail',
            context: {
                user: user,
                appLink: appLink
            }
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Email error ---> ' + error);
            } else {
            console.log('Email sent ---> ' + info.response);
            }
        });

        return res.redirect('/admin');
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.end();
    }

}

module.exports = unconfirmedUsers;