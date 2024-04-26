const pool = require('../../config/dbConfig');
const poolUser = require('../../config/dbConfigUser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
// const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const secretKey = process.env.SECRET_KEY;
const passHash = require('../../public/js/passHash');

const sendMailSafetyNets = async (req, res) => {
    const { app_name } = req.body; 
    const title = "WRO Dirks App | Order";
    const pageHeader = "Order Management";
    const footerDepartName = "Order Management";
    const hrefRedirect = '/order';

    let conn;
    let passwordOutlook;
    let userOutlook;
    let user = '';
    let pass = '';
    let email = '';
    let links;
    let cotTrailer;

    // if (req.cookies.userSave) {

    //     try {
    //         conn = await poolUser.getConnection();
    //         const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
    //         email = await conn.query("SELECT email FROM user WHERE id = ?", [decoded.id]);
    //         const userOut = await conn.query("SELECT first_name, last_name FROM user WHERE id = ?", [decoded.id]);
    //         const passOut = await conn.query("SELECT pass_out FROM outlook WHERE user_id = ?", [decoded.id]);
    
    //         if (passOut[0]) {
    //             passwordOutlook = passHash(passOut[0].pass_out, secretKey);
    //         }
        
    //         userOutlook = `${userOut[0].first_name} ${userOut[0].last_name}`;
    
    //         if (conn) conn.end();
    //     } catch (error) {
    //         console.log(error);
    //     }
    
    //     try {
    //         conn = await pool.getConnection();
    
    //         const selectTo = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'to'", [app_name]);
    //         const selectCc = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'cc'", [app_name]);
    //         const selectSubject = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'subject'", [app_name]);
    
    //         links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
    //         cotTrailer = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='trailer'");
    
    //         let to = [];
    //             cc = [];
    //             subject = selectSubject[0].value;
    
    //         for (i=0; i<selectCc.length; i++) {
    //             cc.push(selectCc[i].value)
    //         }
    //         for (i=0; i<selectTo.length; i++) {
    //             to.push(selectTo[i].value)
    //         }
    
    //         if (conn) conn.end();
    
    //         if (passwordOutlook) {
    //             user = email[0].email;
    //             pass = passwordOutlook;
    //         } else {
    //             user = process.env.NODEMAILER_AUTH_USER;
    //             pass = process.env.NODEMAILER_AUTH_PASSWORD + '#';
    //         }
    
    //         // mail
    //         let transporter = nodemailer.createTransport({
    //             host: process.env.NODEMAILER_HOST,
    //             port: process.env.NODEMAILER_PORT,
    //             secure: false,
    //             auth: {
    //                 user: user,
    //                 pass: pass
    //                 }
    //         });
        
    //         transporter.use('compile', hbs({
    //             viewEngine: {
    //                 extName: ".handlebars",
    //                 partialsDir: path.resolve('./views/mails'),
    //                 defaultLayout: false,
    //               },
    //             viewPath: path.resolve('./views/mails'),
    //             extName: ".handlebars",
    //         }));
            
    //         let mailOptions = {
    //             priority: 'high',
    //             from: user,
    //             to: to,
    //             cc: cc,
    //             subject: subject,
    //             template: app_name,
    //             context: {
    //                 user: userOutlook,
    //                 hrefRedirect: hrefRedirect,
    //                 email: user
    //             }
    //         };
    
    //         transporter.sendMail(mailOptions, (error, info) => {
    //             if (error) {
    //             console.log('Email error ---> ' + error);
    //             const errorInfo = error;
    //             res.render('order', {title, pageHeader, links, cotTrailer, errorInfo, hrefRedirect, footerDepartName});
    //             } else {
    //             console.log('Email sent ---> ' + info.response);
    //             const successInfo = true;
    //             res.render('order', {title, pageHeader, links, cotTrailer, successInfo, user, hrefRedirect, footerDepartName});
    //             }
    //         });
    
    //     } catch (error) {
    //         console.log(error);
    //         const errorInfo = error;
    //         res.render('order', {title, pageHeader, errorInfo, hrefRedirect, footerDepartName, links, cotTrailer});
    //     }

    // } else {
    //     console.log(error);
    // }


}

module.exports = sendMailSafetyNets;