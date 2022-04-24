const nodeMailer = require('nodemailer')

async function sendMiler({ from, to, subject, text, html }){

   let transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
   });
   let info = await transporter.sendMail({
       from:from,
       to:to,
       subject:subject,
       text:text,
       html:html
   })
   console.log(info)

}

module.exports = sendMiler;