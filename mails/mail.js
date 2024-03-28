const nodemailer = require('nodemailer');
require('dotenv').config();
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

function mail(to, cc, subject, template, form) {

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
		to: to,
		cc: cc,
		subject: subject,
		template: template,
		context: {
			form: form
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