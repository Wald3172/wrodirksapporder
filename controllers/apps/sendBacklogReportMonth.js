const pool = require('../../config/dbConfig');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const ExcelJS = require('exceljs');
require('dotenv').config();
const moment = require('moment-timezone');
const getFirstAndLastDayOfPreviousMonth = require('../helpers/getFirstAndLastDayOfPreviousMonth');
const path = require('path');
const reportDate = getFirstAndLastDayOfPreviousMonth().lastDay;
const reportDateStart = getFirstAndLastDayOfPreviousMonth().firstDay;

const sendBacklogReportMonth = async() => {

    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query("SELECT status, box_no, order_no, box, cot_dsp, cot_date, shift, planner, comment, additional_comment FROM backlog WHERE cot_date between ? and ?", [reportDateStart, reportDate]); 
        let lastDate = await conn.query("SELECT myValue FROM info WHERE myKey = 'BacklogReportMonth'"); 

        const rDate = new Date(reportDate);
        const lDate = new Date(lastDate[0].myValue);

        if (rows.length !== 0 && rDate > lDate) {
            rows.forEach(row => {
                if (row.cot_date) {
                  row.cot_date = moment.utc(row.cot_date).tz('Europe/Warsaw').format('DD.MM.YYYY');
                }
              });
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(reportDate);
            const columns = Object.keys(rows[0]);
            worksheet.addRow(columns);
            rows.forEach(row => {
                worksheet.addRow(Object.values(row));
              });
            await workbook.xlsx.writeFile(`public/excel/Backlog report ${reportDate}.xlsx`);
            console.log('Данные успешно экспортированы');

            conn.query("UPDATE info SET myValue = ? WHERE myKey = 'BacklogReportMonth'", [reportDate]);
            if (conn) conn.end();

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
                subject: `Backlog report ${reportDateStart} - ${reportDate}`,
                attachments: [
                    {   
                        filename: `Backlog report ${reportDate}.xlsx`,
                        path: `${__dirname}/../../public/excel/Backlog report ${reportDate}.xlsx` 
                    },
                  ],
                template: 'backlog',
                context: {
                    date: `${reportDateStart} - ${reportDate}`
                }
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.log('Email error ---> ' + error);
                } else {
                console.log('Email sent ---> ' + info.response);
                }
            });
        } 

    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.end();
    }
}

module.exports = sendBacklogReportMonth;