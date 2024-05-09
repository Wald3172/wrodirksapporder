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

const sendMailTrailerWronglyLeft = async (req, res) => {
    const { app_name, date, cot, tdf, trailer, checkbox, checkbox2, textTrailerWronglyLeft } = req.body; 
    const title = 'WRO Dirks App | Zgłaszanie naczep/SB';
    const pageHeader = 'Zgłaszanie naczep/SB';
    const footerDepartName = "Order Management";
    const breadcrumbs = [
        {
            name: 'Order Management',
            href: '/order'
        }
    ];
    const hrefRedirect = '/order/zglaszanie_naczep_sb';
    // const currentDate = ''+new Date().getFullYear()+(new Date().getMonth()+1)+new Date().getDate()+'_'+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'_';
    // const pathName = 'problems_with_sb';
    let attachmentsFilesSharp = [];

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

    let conn;
    let passwordOutlook;
    let userOutlook;
    let user = '';
    let pass = '';
    let email = '';
    let links;
    let cotTrailer;
    let cotSB;

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

        if (checkbox === 'checked') {
            await conn.query("INSERT INTO problems_with_trailer_and_sb (notification_date, cot, number, tdf, reason, number_of_side_boards, user) VALUES (?,?,?,?,?,?,?)", [date, cot, trailer, tdf, 'Trailer left in wrongly place', 0, user]); 
        }

        if (checkbox2 === 'checked') {
            await conn.query("INSERT INTO problems_with_trailer_and_sb (notification_date, cot, number, tdf, reason, number_of_side_boards, user) VALUES (?,?,?,?,?,?,?)", [date, cot, trailer, tdf, 'Trailer left without foot pads', 0, user]); 
        }

        if (textTrailerWronglyLeft) {
            await conn.query("INSERT INTO problems_with_trailer_and_sb (notification_date, cot, number, tdf, reason, number_of_side_boards, user) VALUES (?,?,?,?,?,?,?)", [date, cot, trailer, tdf, textTrailerWronglyLeft, 0, user]);  
        }

        const selectTo = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and cot = ? and param = 'to'", [app_name, cot]);
        const selectCc = await conn.query("SELECT value FROM mail_param WHERE app_name = ? and cot = ? and param = 'cc'", [app_name, cot]);

        links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
        cotTrailer = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='trailer'");
        cotSB = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='container'");

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

        // if (req.files.file.length > 1) {
        //     req.files.file.forEach(element => {
        //         if (element.mimetype === 'image/jpeg' && element.size >= 750000) {
        //             sharp(`public/drive/${pathName}/${currentDate}${element.name}`)
        //                 .jpeg({quality: 80})
        //                 .toFile('public/drive/sharp/'+element.name)
        //                 .then()
        //         } else {
        //             element.mv('public/drive/sharp/'+element.name);
        //         }
        //         attachmentsFilesSharp.push({
        //             filename: element.name,
        //             path: 'public/drive/sharp/'+element.name
        //         });
        //     });
        // } else {
        //     if (req.files.file.mimetype === 'image/jpeg' && req.files.file.size >= 750000) {
        //             sharp(`./public/drive/${pathName}/${currentDate}${req.files.file.name}`)
        //                 .jpeg({quality: 80})
        //                 .toFile('./public/drive/sharp/'+req.files.file.name)
        //                 .then()
        //         } else {
        //             req.files.file.mv('public/drive/sharp/'+req.files.file.name);
        //         }
        //         attachmentsFilesSharp.push({
        //             filename: req.files.file.name,
        //             path: 'public/drive/sharp/'+req.files.file.name
        //         });
        // }
        
        let mailOptions = {
            priority: 'high',
            from: user,
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
                user: userOutlook,
                hrefRedirect: hrefRedirect,
                textTrailerWronglyLeft: textTrailerWronglyLeft,
                email: user
            },
            attachments: attachmentsFilesSharp
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.log('Email error ---> ' + error);
            attachmentsFilesSharp.forEach(element => {
                fs.unlink(element.path, err => {
                    if (err) throw err;
                })
            });
            const errorInfo = error;
            res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, errorInfo, hrefRedirect, footerDepartName});
            } else {
            console.log('Email sent ---> ' + info.response);
            attachmentsFilesSharp.forEach(element => {
                fs.unlink(element.path, err => {
                    if (err) throw err;
                })
            });
            const successInfo = true;
            res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, successInfo, hrefRedirect, footerDepartName});
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
        res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, errorInfo, hrefRedirect, footerDepartName, links, cotTrailer, cotSB});
    }
}

module.exports = sendMailTrailerWronglyLeft;