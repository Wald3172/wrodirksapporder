const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const poolUser = require('../config/dbConfigUser');

async function mail(user, firstName, lastName, email) {

	// admin group emails
	let conn;
	let adminMails = '';
	const appLink = process.env.START_APP_LINK;

	try {
		conn = await poolUser.getConnection();
		const result = await conn.query("SELECT email FROM user WHERE role = 'admin'");
		result.forEach(element => {
			adminMails += ` ${element.email};`
		});
	} catch (error) {
		console.log(error);
		if (conn) conn.end();
	}

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
		priority: 'high',
		from: process.env.NODEMAILER_AUTH_USER,
		to: adminMails,
		subject: `WRO Dirks App - nowe konto dla użytkownika: ${user}`,
		template: 'registerMail',
		context: {
			user: user,
			firstName: firstName,
			lastName: lastName,
			email: email,
			appLink: appLink
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

module.exports = mail;