const nodeMailer = require('nodemailer')
require('dotenv').config();

const email = process.env.email
const password = process.env.password

const transporter =
nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:email,
        pass:password
    }

})


module.exports = transporter