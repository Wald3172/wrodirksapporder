const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const pool = require('../../config/dbConfig');
const addOneSecond = require('../helpers/addOneSecond');
const fetchData = require('../helpers/fetchData');

const DTRSarticleHandling = async() => {
    let conn;
    try {
        conn = await pool.getConnection();
        let lastDateAndTime = await conn.query("SELECT myValue FROM info WHERE myKey = 'DTRSarticleHandling'"); 

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const timestampStart = lastDateAndTime[0].myValue.replace(' ', '%20');
        const timestampEnd = `${year}-${month}-${day}%2023:59:59`;
        
        const url = `http://dg150ap03:8080/DTClone/rest/logs?level=INFO&from=${timestampStart}&to=${timestampEnd}&ref=article`;

        fetchData(url).then(data => {
            if (data.length !== 0) {
                data.forEach(element => {
                    element.message = element.message.split(', ').map(item => item.trim());
                    for (let i = 0; i < element.message.length; i++) {
                        if (i === 0) {
                            element.message[i] = element.message[i].replace(' Article Handling for','');
                        } else if (i === 1) {
                            element.message[i] = element.message[i].replace('box: ','');
                            element.message[i] = element.message[i].replace(' and','');
                        }
                        else if (i === 2) {
                            element.message[i] = element.message[i].replace('target box: ','');
                        }
                    }
                });
                let articles = [];
                data.forEach(element => {
                    articles.push(element);
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
                    subject: 'Zmiany w ustawieniach DTRS - Article Handling',
                    template: 'DTRSarticleHandling',
                    context: {
                        articles: articles,
                    }
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                    console.log('Email error ---> ' + error);
                    } else {
                    console.log('Email sent ---> ' + info.response);
                    }
                });

                lastDateAndTime = addOneSecond(data[data.length-1].dateTime);
                conn.query("UPDATE info SET myValue = ? WHERE myKey = 'DTRSarticleHandling'", [lastDateAndTime]);
                if (conn) conn.end();
            }  
        });
        if (conn) conn.end();
    } catch (error) {
        console.log(error);
    }
}

module.exports = DTRSarticleHandling;