const poolUser = require('../../config/dbConfigUser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const deleteUsers = async (req, res) => {

    const { id, email } = req.body;

    let conn;

    try {
        conn = await poolUser.getConnection();
        await conn.query("DELETE FROM user WHERE id = ?", [id]);

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
            subject: `WRO Dirks App - konto zostało usunięte`,
            template: 'deleteUserMail',
            context: {
                email: email
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

module.exports = deleteUsers;