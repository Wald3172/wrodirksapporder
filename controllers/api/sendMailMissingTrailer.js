const pool = require('../../config/dbConfig');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const sendMailMissingTrailer = async (req, res) => {
    const { app_name, date, cot, tdf, trailer } = req.body; 
    const title = 'WRO Dirks App | Order';
    const pageHeader = 'Order Management';
    const user = '';
    const hrefRedirect = '/order';

    let conn;

    try {
        conn = await pool.getConnection();

        await conn.query("INSERT INTO missing_trailer (date, cot, tdf, trailer, user) VALUES (?,?,?,?,?)", [date, cot, tdf, trailer, user]);
        const selectTo = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and cot = ? and param = 'to'", [app_name, cot]);
        const selectCc = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and cot = ? and param = 'cc'", [app_name, cot]);

        const links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
        const cotTrailer = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='trailer'");
        const cotSB = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='container'");

        let to = [];
            cc = [];
            
        const subject = `WRO missing trailer - ${cot} - ${date}`;

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
            context: {
                date: date,
                tdf: tdf,
                trailer: trailer,
                user: user,
                hrefRedirect: hrefRedirect
            }
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Email error ---> ' + error);
            const errorInfo = error;
            res.render('order', {title, pageHeader, links, cotTrailer, errorInfo, hrefRedirect});
            } else {
            console.log('Email sent ---> ' + info.response);
            const successInfo = true;
            res.render('order', {title, pageHeader, links, cotTrailer, successInfo, hrefRedirect});
            }
        });

    } catch (error) {
        console.log(error);
        const errorInfo = error;
        res.render('order', {title, pageHeader, links, cotTrailer, errorInfo, hrefRedirect});
    }
}

module.exports = sendMailMissingTrailer;