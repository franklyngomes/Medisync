const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user:process.env.NODEMAILER_EMAIL ,
    pass:process.env.NODEMAILER_PASSWORD
  }
})

module.exports = transporter