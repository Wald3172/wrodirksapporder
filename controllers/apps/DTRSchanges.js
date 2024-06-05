const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pool = require('../../config/dbConfig');
const addOneSecond = require('../helpers/addOneSecond');

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
        // const timestampStart = '2024-05-28%2000:00:00';
        const timestampEnd = `${year}-${month}-${day}%2023:59:59`;
        
        const url = `http://dg150ap03:8080/DTClone/log?level=INFO&from=${timestampStart}&to=${timestampEnd}`;
    
        axios.get(url)
            .then(response => {
                if (response.data) {
                    const data = response.data;
                    const lines = data.trim().split('\n');
                    const objects = lines.map(line => {
                        const [timestamp, level, source, ...rest] = line.split(', ');
                        const data = rest.map(item => item.replace(/\r/g, ''));
                        for (let i = 0; i < data.length; i++) {
                            if (i === 0) {
                                data[i] = data[i].replace('Box: ','');
                            } else if (i === 1) {
                                data[i] = data[i].replace('mapped from: ','');
                            }
                            else if (i === 2) {
                                data[i] = data[i].replace('payload min: ','');
                            }
                            else if (i === 3) {
                                data[i] = data[i].replace('payload max: ','');
                            }
                            else if (i === 4) {
                                data[i] = data[i].replace('type=','');
                            }
                            else if (i === 5) {
                                data[i] = data[i].replace('limit: ','');
                            }
                            else if (i === 6) {
                                data[i] = data[i].replace('active=: ','');
                            }
                        }
                        return { timestamp: timestamp.trim(), level, source, data };
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
                            data: objects
                        }
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                        console.log('Email error ---> ' + error);
                        } else {
                        console.log('Email sent ---> ' + info.response);
                        }
                    });

                    lastDateAndTime = addOneSecond(objects[objects.length-1].timestamp);
                    conn.query("UPDATE info SET myValue = ? WHERE myKey = 'DTRSchanges'", [lastDateAndTime]);
                    console.log(objects);
                }   
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            });

        if (conn) conn.end();
    } catch (error) {
        console.log(error);
    }
}

module.exports = DTRSchanges;