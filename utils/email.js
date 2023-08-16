/* eslint-disable  */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email{
    constructor(user, url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        // this.from = `Sakeerin Khami <${process.env.EMAIL_FROM}>`; // for development
        this.from = `Sakeerin Khami <${process.env.SENDGRID_EMAIL_FROM}>`; //for production
    }

    newTransport(){
        if(process.env.NODE_ENV === 'production'){
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
            // Activate in gmail "less secure app" option
        });
    }

    // Send the actual email
    async send(template, subject){
        // 1) Render HTML base on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName: this.firstName,
            url: this.url,
            subject: subject
        });

        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText.convert(html)
        };

        // 3) Create a transport and send email
        // this.newTransport();
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
};

// const sendEmail = async options => {
//     // 1) Create a transporter
//     // const transporter = nodemailer.createTransport({
//     //     host: process.env.EMAIL_HOST,
//     //     port: process.env.EMAIL_PORT,
//     //     auth: {
//     //         user: process.env.EMAIL_USERNAME,
//     //         pass: process.env.EMAIL_PASSWORD
//     //     }
//     //     // Activate in gmail "less secure app" option
//     // });

//     // 2) Define the email options
//     // const mailOptions = {
//     //     from: 'Sakeerin Khami <admin@gmail.com>',
//     //     to: options.email,
//     //     subject: options.subject,
//     //     text: options.message,
//     //     // html
//     // };

//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions)
// };

// module.exports = sendEmail;