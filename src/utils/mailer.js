const config = require("../config/config.json");
const { createTransport } = require("nodemailer");

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: config.development.GMAILUSER,
    pass: config.development.GMAILPASS,
  },
});

const createEmailTemplate = (data) => {
  return {
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #007BFF;
              color: #fff;
              padding: 20px;
              text-align: center;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .email-body table {
              width: 100%;
              border-collapse: collapse;
            }
            .email-body table td {
              padding: 10px;
              vertical-align: top;
            }
            .email-body table td:first-child {
              font-weight: bold;
              color: #555;
              width: 30%;
            }
            .email-body table td:last-child {
              color: #000;
            }
            .email-footer {
              text-align: center;
              padding: 10px;
              background-color: #f1f1f1;
              font-size: 14px;
              color: #555;
            }
          </style>
        </head>
        <body>
         <h2>${data.message}</h2>
        </body>
      </html>
    `,
  };
};

exports.sendEmail = async (data) => {
  try {
    const { html } = createEmailTemplate(data);

    const mailOptions = {
      from: config.development.GMAILUSER,
      to: data.to,
      subject: data.subject,
      html: html,
      attachments: data.additionalAttachments,
    };

    // Conditionally add `cc` and `bcc` fields if provided
    if (data?.cc) {
      mailOptions.cc = data?.cc;
    }
    if (data?.bcc) {
      mailOptions.bcc = data?.bcc;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
