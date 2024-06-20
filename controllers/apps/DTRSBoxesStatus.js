const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pool = require('../../config/dbConfig');
const fetchData = require('../helpers/fetchData');

const DTRSBoxesStatus = async() => {
    let conn;
    try {
        conn = await pool.getConnection();
        let lastDate = await conn.query("SELECT myValue FROM info WHERE myKey = 'DTRSBoxesStatus'"); 

        const today = new Date();
        today.setDate(today.getDate() - 1);
        const yearStart = today.getFullYear();
        const monthStart = String(today.getMonth() + 1).padStart(2, '0');  
        const dayStart = String(today.getDate()).padStart(2, '0');
        const reportDate = `${yearStart}-${monthStart}-${dayStart}`;

        if (lastDate[0].myValue !== reportDate) {
            const url = `http://dg150ap03:8080/DTClone/boxes`;
            fetchData(url).then(data => {
                if (data.length !== 0) {
                    let rows = [];
                    data.forEach(element => {
                        if (element.derived !== '') {
                            rows.push(element);
                        }
                    });

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
                        priority: 'normal',
                        from: process.env.NODEMAILER_AUTH_USER,
                        to: 'vyakovenko@dirks-group.de',
                        // to: 'order.wro@dirks-group.de',
                        cc: '',
                        subject: `DTRS - tłumaczenie kartonów z dnia ${dayStart}.${monthStart}.${yearStart}`,
                        template: 'DTRSBoxesStatus',
                        context: {
                            rows: rows
                        }
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                        console.log('Email error ---> ' + error);
                        } else {
                        console.log('Email sent ---> ' + info.response);
                        }
                    });

                    conn.query("UPDATE info SET myValue = ? WHERE myKey = 'DTRSBoxesStatus'", [reportDate]);
                    if (conn) conn.end();
                }  
            });
        } else {
            if (conn) conn.end();
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = DTRSBoxesStatus;