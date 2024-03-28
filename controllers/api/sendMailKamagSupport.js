const pool = require('../../config/dbConfig');
const mail = require('../../mails/mail');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const sendMailKamagSupport = async (req, res) => {
    const { app_name } = req.body; 
    const title = 'WRO Dirks App | Order';
    const pageHeader = "Order Management";

    let conn;

    try {
        conn = await pool.getConnection();

        const selectTo = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'to'", [app_name]);
        const selectCc = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'cc'", [app_name]);
        const selectSubject = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'subject'", [app_name]);

        const links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
        const cotTrailer = await conn.query("SELECT DISTINCT cot_2 FROM list_of_cot WHERE sb='trailer'");
        const cotSB = await conn.query("SELECT DISTINCT cot_2 FROM list_of_cot WHERE sb='container'");


        let to = [];
            cc = [];
            subject = selectSubject[0].value;

        for (i=0; i<selectCc.length; i++) {
            cc.push(selectCc[i].value)
        }
        for (i=0; i<selectTo.length; i++) {
            to.push(selectTo[i].value)
        }

        if (conn) conn.end();

        // mail
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
            to: to,
            cc: cc,
            subject: subject,
            template: app_name,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Email error ---> ' + error);
            const errorInfo = error;
            res.render('order', {title, pageHeader, links, cotTrailer, errorInfo});
            } else {
            console.log('Email sent ---> ' + info.response);
            const successInfo = true;
            res.render('order', {title, pageHeader, links, cotTrailer, successInfo});
            }
        });

    } catch (error) {
        console.log(error);
        const errorInfo = error;
        res.render('order', {title, pageHeader, links, cotTrailer, errorInfo});
    }
}

module.exports = sendMailKamagSupport;