const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;
     // 1) Create a transporter
    
     transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: process.env.EMAIL_USERNAME_APP,
           pass: process.env.EMAIL_PASSWORD_APP,
       },
       from: process.env.EMAIL_USERNAME_APP,
     });
  
     let mailOptions;
     // 2) Define the email options
     mailOptions = {
        from: 'Sajjad hossain <sajjadhossainsb01@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
     }
    
    // 3) Actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;