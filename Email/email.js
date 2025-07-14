const nodeMailer = require('nodemailer')


const transporter =
nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:'udaykirandhage@gmail.com',
        pass:'xawuxkrrejmzizyt'
    }

})


module.exports = transporter