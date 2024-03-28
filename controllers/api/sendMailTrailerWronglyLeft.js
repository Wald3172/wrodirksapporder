const pool = require('../../config/dbConfig');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const sendMailTrailerWronglyLeft = async (req, res) => {
    const { app_name, date, cot, tdf, trailer, checkbox, checkbox2 } = req.body; 
    const user = '';
    const title = 'WRO Dirks App | Zgłaszanie naczep/SB';
    const pageHeader = 'Zgłaszanie naczep/SB';
    const breadcrumbs = [
        {
            name: 'Order Management',
            href: '/order'
        }
    ];

    let conn;

    try {
        conn = await pool.getConnection();

        if (checkbox === 'checked') {
            await conn.query("INSERT INTO problems_with_trailer_and_sb (notification_date, cot, number, tdf, reason, number_of_side_boards, user) VALUES (?,?,?,?,?,?,?)", [date, cot, trailer, tdf, 'Trailer left in wrongly place', 0, user]); 
        }

        if (checkbox2 === 'checked') {
            await conn.query("INSERT INTO problems_with_trailer_and_sb (notification_date, cot, number, tdf, reason, number_of_side_boards, user) VALUES (?,?,?,?,?,?,?)", [date, cot, trailer, tdf, 'Trailer left without foot pads', 0, user]); 
        }

        const selectTo = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and cot = ? and param = 'to'", [app_name, cot]);
        const selectCc = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and cot = ? and param = 'cc'", [app_name, cot]);

        const links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
        const cotTrailer = await conn.query("SELECT DISTINCT cot_2 FROM list_of_cot WHERE sb='trailer'");
        const cotSB = await conn.query("SELECT DISTINCT cot_2 FROM list_of_cot WHERE sb='container'");

        let to = [];
            cc = [];
            
        const subject = `Trailer ${trailer} wrongly left in the yard in WRO`;

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
            template: 'trailer_wrongly_left',
            context: {
                date: date,
                tdf: tdf,
                trailer: trailer,
                checkbox: checkbox,
                checkbox2: checkbox2,
                user: user
            }
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Email error ---> ' + error);
            const errorInfo = error;
            res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, errorInfo});
            } else {
            console.log('Email sent ---> ' + info.response);
            const successInfo = true;
            res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, successInfo});
            }
        });

    } catch (error) {
        console.log(error);
        const errorInfo = error;
        res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, errorInfo});
    }
}

module.exports = sendMailTrailerWronglyLeft;