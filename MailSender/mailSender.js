const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env["EMAIL_HOST"],
  port: process.env["EMAIL_PORT"],
  secure: true,

  auth: {
    user: process.env["EMAIL_USER"],
    pass: process.env["EMAIL_PASS"],
  },
});

const SendEmail = (result) => {
  return new Promise((resolve, reject) => {
    // console.log(result);
    const mailOptions = {
      to: process.env["EMAIL_TO"],
      from: result.email,
      subject: `Inquire - ${result.subject}`,
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
        <p>My name is ${result.name}</p><br>
         <p>${result.details}</p>
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
    console.log("email send");
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendMailforResetPassword = async (email,resetToken) => {
  // console.log(resetToken);
  return new Promise(async (resolve, reject) => {
    try {
      // Email HTML template
      const mailContent = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
        </head>
        <body
          style="
            background-color: #ffffff;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          "
        >
          <table
            align="center"
            width="100%"
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="max-width: 600px; margin: 0 auto"
          >
            <tr>
              <td style="text-align: center; padding: 20px 0">
                <img
                  src="https://evvisolutions.com/assets/Evvi_new-CRc-dtpu.png"
                  height="50"
                  alt="Evvi Solutions"
                />
              </td>
            </tr>
            <tr>
              <td
                style="
                  background-color: #f7f7f7;
                  padding: 30px;
                  text-align: left;
                  border-radius: 8px;
                "
              >
                <h1 style="color: #333; font-size: 24px">Reset your password</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.6">
                  We received a request to reset the password associated with your
                  email. If you made this request, please click the button below to
                  reset your password:
                </p>
                <div style="text-align: center; margin: 20px 0">
                  <a
                    href="https://www.evvisolutions.com//resetPassword?token=${resetToken}"
                    style="
                      background-color: #4caf50;
                      color: #ffffff;
                      padding: 10px 20px;
                      border-radius: 5px;
                      text-decoration: none;
                    "
                    >Reset Password</a
                  >
                </div>
                <p style="font-size: 14px; color: #999">
                  If you did not request a password reset, you can safely ignore this
                  email.
                </p>
                <p style="font-size: 12px; color: #999; margin-top: 20px">
                  ©2024 Evvi Solutions Private Limited, TCE - TBI, Thiyagarajar
                  Advanced Research Centre, Thiruparankundram, Madurai-625015. All
                  rights reserved.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px">
                <a
                  href="https://www.evvisolutions.com/Blog"
                  style="color: #b7b7b7; text-decoration: underline"
                  >Our blog</a
                >
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px">
                <div style="display: flex; justify-content: center;">
                  <div>
                    <a
                      href="https://www.facebook.com/evvisolutions"
                      style="margin-right: 15px"
                    >
                      <img
                        src="https://react-email-demo-hbzssj3q3-resend.vercel.app/static/slack-facebook.png"
                        alt="Facebook"
                        width="32"
                        height="32"
                      />
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://twitter.com/evvisolutions"
                      style="margin-right: 15px"
                    >
                      <img
                        src="https://react-email-demo-hbzssj3q3-resend.vercel.app/static/slack-twitter.png"
                        alt="Twitter"
                        width="32"
                        height="32"
                      />
                    </a>
                  </div>
                  <div>
                    <a href="https://www.linkedin.com/company/evvisolutions">
                      <img
                        src="https://react-email-demo-hbzssj3q3-resend.vercel.app/static/slack-linkedin.png"
                        alt="LinkedIn"
                        width="32"
                        height="32"
                      />
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>`;

      // Send email
      let info = await transporter.sendMail({
        from: "info@evvisolutions.com", // sender address
        to:  email, // recipient address
        subject: "Reset Your Password-Regards", // Subject line
        html: mailContent, // email body (HTML)
      });

      resolve(info); // Resolves when email is successfully sent
    } catch (error) {
      reject(error); // Rejects on error
    }
  });
};

module.exports = { SendEmail, sendMailforResetPassword };
