const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // For testing with Ethereal (fake SMTP) – no real email needed
  // Or use Gmail with app password
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // For Ethereal
};

module.exports = sendEmail;