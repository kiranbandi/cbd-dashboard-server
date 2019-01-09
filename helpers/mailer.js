const nodemailer = require('nodemailer');
const config = require('../config');
var winston = require('./winston');
// Configure Mail Client 

var mailer = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cbd.usask@gmail.com',
        pass: config.PASSWORD
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

mailer.sendMail = function(toMailAddress, mailMessage) {

    const mailOptions = {
        from: 'cbd.usask@gmail.com',
        to: toMailAddress,
        subject: 'CBD Project Report',
        text: mailMessage
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            winston.error(error);
        } else {
            winston.info('Email sent to ' + toMailAddress);
        }
    });
}

module.exports = mailer;