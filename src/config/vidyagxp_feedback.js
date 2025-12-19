const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();


const transporter = nodemailer.createTransport({
    service: "gmail", // For Gmail as the service
    auth: {
      user: "quality@vidyagxp.com",
      pass: "iwhh mwod abrj ilbs",
    },
  });
  
  // Route to handle POST requests
  router.post("/send-feedback", (req, res) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      lookingFor,
      subject,
      message,
    } = req.body;
  
    const mailOptions = {
      from: "quality@vidyagxp.com", // Email to send from
      replyTo: email, // User's email set as reply-to
      to: "quality@vidyagxp.com", // Destination email address
      subject: `Feedback from ${firstName} ${middleName} ${lastName} - ${subject}`, // Email subject line
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #0056b3;">New Feedback Submission</h2>
              <p>You have received a new feedback message from:</p>
              <ul>
                  <li><strong>Name:</strong> ${firstName} ${middleName} ${lastName}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Mobile:</strong> ${mobileNumber}</li>
                  <li><strong>Looking For:</strong> ${lookingFor}</li>
                  <li><strong>Subject:</strong> ${subject}</li>
                  <li><strong>Message:</strong> ${message}</li>
              </ul>
              <p>This message was sent from the feedback form on your website.</p>
            </div>`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to send feedback",
          error: error.message,
        });
      }
      res.status(200).json({
        success: true,
        message: "Feedback sent successfully",
      });
    });
  });

  module.exports = router;