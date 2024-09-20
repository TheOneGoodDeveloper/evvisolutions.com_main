const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env['EMAIL_HOST'],
  port: process.env['EMAIL_PORT'],
  secure: true,
  
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASS'],
  },
});

 const SendEmail = (result) => {
  return new Promise((resolve, reject) => {
    console.log(result);
    const mailOptions = {
      to: process.env['EMAIL_TO'],
      from: result.email,
      subject: `${result.subject}`,
      // text: "hello",
      html: `<!DOCTYPE html>

    <title>${result.subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        h1 {
            color: #333;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .contact-details {
            margin-top: 20px;
        }
        .contact-details p {
            margin: 5px 0;
        }
        .signature {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>${result.subject}</h1>
        <p>Dear Representative, </p>
        <p>I hope this message finds you well.</p>
        <p>My name is ${result.name}, ${result.details}</p>
        <div class="contact-details">
            <p><strong>Phone:</strong> ${result.phone}</p>
            <p><strong>Email:</strong> ${result.email}</p>
        </div>
        <div class="signature">
            <p>Best regards,</p>
            <p>${result.name}</p>
            <p>${result.phone}</p>
        </div>
    </div>
</body>
</html>
`,
    };
    console.log("email send")
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = SendEmail;