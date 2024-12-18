import nodemailer from 'nodemailer';
import { productHtml } from '../utils/emailHTML.js';

const mail = ({ recepient, subject, products }, user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        // logger: true,
        // debug: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: true,
        },
    });



    // Generate product rows for the table


    const mailOptions = {
        from: process.env.EMAIL,
        to: recepient,
        subject: subject,
        html: productHtml(products, user)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};



export default mail;