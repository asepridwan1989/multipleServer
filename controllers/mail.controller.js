const nodemailer = require("nodemailer");

const user = process.env.EMAIL
const pass = process.env.PASS

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${user}`,
    pass: `${pass}`
  }
});

module.exports = {
  sendNotification: (req, res) => {

  }
}
