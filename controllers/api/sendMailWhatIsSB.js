const pool = require('../../config/dbConfig');
const poolUser = require('../../config/dbConfigUser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const CryptoJS = require('crypto-js');

const sendMailWhatIsSB = async (req, res) => {
    const { app_name, numberOfSB } = req.body; 

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

    if (req.cookies.userSave) {

        try {
            conn = await poolUser.getConnection();
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
            email = await conn.query("SELECT email FROM user WHERE id = ?", [decoded.id]);
            const userOut = await conn.query("SELECT first_name, last_name FROM user WHERE id = ?", [decoded.id]);
            const passOut = await conn.query("SELECT pass_out FROM outlook WHERE user_id = ?", [decoded.id]);
    
            passwordOutlook = CryptoJS.enc.Base64.parse(passOut[0].pass_out).toString(CryptoJS.enc.Utf8);
        
            userOutlook = `${userOut[0].first_name} ${userOut[0].last_name}`;
    
            if (conn) conn.end();
        } catch (error) {
            console.log(error);
        }
    
        try {
            conn = await pool.getConnection();
    
            const selectToHER = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'to' and cot = 'HER'", [app_name]);
            const selectCcHER = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'cc' and cot = 'HER'", [app_name]);
            const selectToDHL = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'to' and cot = 'DHL_DE'", [app_name]);
            const selectCcDHL = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'cc' and cot = 'DHL_DE'", [app_name]);
    
            links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
    
            let toHER = [];
                ccHER = [];
    
            for (i=0; i<selectCcHER.length; i++) {
                ccHER.push(selectCcHER[i].value)
            }
            for (i=0; i<selectToHER.length; i++) {
                toHER.push(selectToHER[i].value)
            }

            let toDHL = [];
                ccDHL = [];

            for (i=0; i<selectCcDHL.length; i++) {
                ccDHL.push(selectCcDHL[i].value)
            }
            for (i=0; i<selectToDHL.length; i++) {
                toDHL.push(selectToDHL[i].value)
            }

            if (conn) conn.end();
    
            if (passwordOutlook) {
                user = email[0].email;
                pass = passwordOutlook;
            } else {
                user = process.env.NODEMAILER_AUTH_USER;
                pass = process.env.NODEMAILER_AUTH_PASSWORD + '#';
            }
    
            // mail
            let transporter = nodemailer.createTransport({
                host: process.env.NODEMAILER_HOST,
                port: process.env.NODEMAILER_PORT,
                secure: false,
                auth: {
                    user: user,
                    pass: pass
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
                from: user,
                to: to,
                cc: cc,
                subject: `The container ${numberOfSB} is DHL?`,
                template: app_name,
                context: {
                    user: userOutlook,
                    hrefRedirect: hrefRedirect,
                    email: user,
                    numberOfSB: numberOfSB
                }
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.log('Email error ---> ' + error);
                const errorInfo = error;
                res.render('order', {title, pageHeader, links, errorInfo, hrefRedirect, footerDepartName});
                } else {
                console.log('Email sent ---> ' + info.response);

                mailOptions = {
                    priority: 'high',
                    from: user,
                    to: toHER,
                    cc: ccHER,
                    subject: `The container ${numberOfSB} is Hermes?`,
                    template: app_name,
                    context: {
                        user: userOutlook,
                        hrefRedirect: hrefRedirect,
                        email: user,
                        numberOfSB: numberOfSB
                    }
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                    console.log('Email error ---> ' + error);
                    const errorInfo = error;
                    res.render('order', {title, pageHeader, links, errorInfo, hrefRedirect, footerDepartName});
                    } else {
                    console.log('Email sent ---> ' + info.response);
                    const successInfo = true;
                    res.render('order', {title, pageHeader, links, successInfo, hrefRedirect, footerDepartName});
                    }
                });
                }
            });
    
        } catch (error) {
            console.log(error);
            const errorInfo = error;
            res.render('order', {title, pageHeader, errorInfo, hrefRedirect, footerDepartName, links});
        }

    } else {
        console.log(error);
    }


}

module.exports = sendMailWhatIsSB;