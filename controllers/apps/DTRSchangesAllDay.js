const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pool = require('../../config/dbConfig');
const fetchData = require('../helpers/fetchData');

const DTRSchangesAllDay = async() => {
    let conn;
    try {
        conn = await pool.getConnection();
        let lastDate = await conn.query("SELECT myValue FROM info WHERE myKey = 'DTRSchangesAllDay'"); 

        const today = new Date();
        today.setDate(today.getDate() - 1);
        const yearStart = today.getFullYear();
        const monthStart = String(today.getMonth() + 1).padStart(2, '0');  
        const dayStart = String(today.getDate()).padStart(2, '0');
        const reportDate = `${yearStart}-${monthStart}-${dayStart}`;

        if (lastDate[0].myValue !== reportDate) {
            const now = new Date();
            const yearEnd = now.getFullYear();
            const monthEnd = String(now.getMonth() + 1).padStart(2, '0');
            const dayEnd = String(now.getDate()).padStart(2, '0');
            const timestampStart = `${yearStart}-${monthStart}-${dayStart}%2000:00:00`;
            const timestampEnd = `${yearEnd}-${monthEnd}-${dayEnd}%2002:59:59`;
    
            const url = `http://dg150ap03:8080/DTClone/logs?level=INFO&from=${timestampStart}&to=${timestampEnd}&ref=boxes`;

            fetchData(url).then(data => {
                if (data.length !== 0) {
                    data.forEach(element => {
                        element.message = element.message.split(', ').map(item => item.trim());
                        for (let i = 0; i < element.message.length; i++) {
                            if (i === 0) {
                                element.message[i] = element.message[i].replace('Box: ','');
                                element.message[i] = element.message[i].replace('Updated Box Map Limit for box: ','');
                                element.message[i] = element.message[i].replace('and backup box:','--->');
                            } else if (i === 1) {
                                element.message[i] = element.message[i].replace('mapped from:','');
                                element.message[i] = element.message[i].replace('limit per batch: ','');
                            }
                            else if (i === 2) {
                                element.message[i] = element.message[i].replace('payload min: ','');
                                element.message[i] = element.message[i].replace('limit per hour: ','');
                            }
                            else if (i === 3) {
                                element.message[i] = element.message[i].replace('payload max: ','');
                            }
                            else if (i === 4) {
                                element.message[i] = element.message[i].replace('type: ','');
                            }
                            else if (i === 5) {
                                element.message[i] = element.message[i].replace('packing: ','');
                            }
                            else if (i === 6) {
                                element.message[i] = element.message[i].replace('active=: ','');
                            }
                        }
                    });
                    let boxes = [];
                    let mapLimits = [];
                    data.forEach(element => {
                        if (element.message[0].length < 10) {
                            boxes.push(element);
                        } else {
                            mapLimits.push(element);
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
                        to: 'order.wro@dirks-group.de',
                        cc: '',
                        subject: `Zmiany w ustawieniach DTRS z dnia ${dayStart}.${monthStart}.${yearStart}`,
                        template: 'DTRSchanges',
                        context: {
                            boxes: boxes,
                            mapLimits: mapLimits
                        }
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                        console.log('Email error ---> ' + error);
                        } else {
                        console.log('Email sent ---> ' + info.response);
                        }
                    });

                    conn.query("UPDATE info SET myValue = ? WHERE myKey = 'DTRSchangesAllDay'", [reportDate]);
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

module.exports = DTRSchangesAllDay;