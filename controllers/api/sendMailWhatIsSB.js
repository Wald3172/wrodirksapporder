const pool = require('../../config/dbConfig');
const poolUser = require('../../config/dbConfigUser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const CryptoJS = require('crypto-js');
const fs = require('fs');
// const sharp = require('sharp');

const sendMailWhatIsSB = async (req, res) => {
    const { app_name, numberOfSB } = req.body; 

    const title = "WRO Dirks App | Order";
    const pageHeader = "Order Management";
    const footerDepartName = "Order Management";
    const hrefRedirect = '/order';
    // const currentDate = ''+new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate()+'_'+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'_';
    // const pathName = 'what_is_sb';
    let attachmentsFilesSharp = [];

    if (req.files) {
        if (req.files.file.length > 1) {
            req.files.file.forEach(element => {
                element.mv(`public/drive/sharp/${element.name}`);
                attachmentsFilesSharp.push({
                    filename: element.name,
                    path: 'public/drive/sharp/'+element.name
                });
                // element.mv(`public/drive/${pathName}/${currentDate}${element.name}`);
            });        
        } else {
            req.files.file.mv(`public/drive/sharp/${req.files.file.name}`);
            attachmentsFilesSharp.push({
                filename: req.files.file.name,
                path: 'public/drive/sharp/'+req.files.file.name
            });
        }
    }

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
    
            if (!passOut.length === 0) {
                passwordOutlook = CryptoJS.enc.Base64.parse(passOut[0].pass_out).toString(CryptoJS.enc.Utf8);
            }
        
            userOutlook = `${userOut[0].first_name} ${userOut[0].last_name}`;
    
            if (conn) conn.end();
        } catch (error) {
            console.log(error);
        }
    
        try {
            conn = await pool.getConnection();
    
            const selectToDHL = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'to' and cot = 'DHL_DE'", [app_name]);
            const selectCcDHL = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and param = 'cc' and cot = 'DHL_DE'", [app_name]);
    
            links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");


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

            // if (req.files) {
            //     if (req.files.file.length > 1) {
            //         req.files.file.forEach(element => {
            //             if (element.mimetype === 'image/jpeg' && element.size >= 750000) {
            //                 sharp(`public/drive/${pathName}/${currentDate}${element.name}`)
            //                     .jpeg({quality: 80})
            //                     .toFile('public/drive/sharp/'+element.name)
            //                     .then()
            //             } else {
            //                 element.mv('public/drive/sharp/'+element.name);
            //             }
            //             attachmentsFilesSharp.push({
            //                 filename: element.name,
            //                 path: 'public/drive/sharp/'+element.name
            //             });
            //         });
            //     } else {
            //         if (req.files.file.mimetype === 'image/jpeg' && req.files.file.size >= 750000) {
            //                 sharp(`./public/drive/${pathName}/${currentDate}${req.files.file.name}`)
            //                     .jpeg({quality: 80})
            //                     .toFile('./public/drive/sharp/'+req.files.file.name)
            //                     .then()
            //             } else {
            //                 req.files.file.mv('public/drive/sharp/'+req.files.file.name);
            //             }
            //             attachmentsFilesSharp.push({
            //                 filename: req.files.file.name,
            //                 path: 'public/drive/sharp/'+req.files.file.name
            //             });
            //     }
            // }
            
            let mailOptions = {
                priority: 'high',
                from: user,
                to: toDHL,
                cc: ccDHL,
                subject: `The container ${numberOfSB} is DHL?`,
                template: app_name,
                context: {
                    user: userOutlook,
                    hrefRedirect: hrefRedirect,
                    email: user,
                    numberOfSB: numberOfSB
                },
                attachments: attachmentsFilesSharp
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.log('Email error ---> ' + error);
                const errorInfo = error;
                res.render('order', {title, pageHeader, links, errorInfo, hrefRedirect, footerDepartName});
                } else {
                console.log('Email sent ---> ' + info.response);
                }
            });
    
        } catch (error) {
            console.log(error);
            attachmentsFilesSharp.forEach(element => {
                fs.unlink(element.path, err => {
                    if (err) throw err;
                })
            });
            const errorInfo = error;
            res.render('order', {title, pageHeader, errorInfo, hrefRedirect, footerDepartName, links});
        }

    } else {
        console.log(error);
    }


}

module.exports = sendMailWhatIsSB;