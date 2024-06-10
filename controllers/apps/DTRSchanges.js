const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pool = require('../../config/dbConfig');
const addOneSecond = require('../helpers/addOneSecond');
const fetchData = require('../helpers/fetchData');

const DTRSchanges = async() => {
    let conn;
    try {
        conn = await pool.getConnection();
        let lastDateAndTime = await conn.query("SELECT myValue FROM info WHERE myKey = 'DTRSchanges'"); 

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const timestampStart = lastDateAndTime[0].myValue.replace(' ', '%20');
        const timestampEnd = `${year}-${month}-${day}%2023:59:59`;
        
        const url = `http://dg150ap03:8080/DTClone/logs?level=INFO&from=${timestampStart}&to=${timestampEnd}`;

        fetchData(url).then(data => {
            if (data.length !== 0) {
                data.forEach(element => {
                    element.message = element.message.split(', ').map(item => item.trim());
                    for (let i = 0; i < element.message.length; i++) {
                        if (i === 0) {
                            element.message[i] = element.message[i].replace('Box: ','');
                        } else if (i === 1) {
                            element.message[i] = element.message[i].replace('mapped from:','');
                        }
                        else if (i === 2) {
                            element.message[i] = element.message[i].replace('payload min: ','');
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
                            element.message[i] = element.message[i].replace('limit: ','');
                        }
                        else if (i === 7) {
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
                    subject: 'Zmiany w ustawieniach DTRS',
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

                lastDateAndTime = addOneSecond(result[result.length-1].timestamp);
                conn.query("UPDATE info SET myValue = ? WHERE myKey = 'DTRSchanges'", [lastDateAndTime]);
                if (conn) conn.end();
            }  
        });
        if (conn) conn.end();
    } catch (error) {
        console.log(error);
    }
}

module.exports = DTRSchanges;