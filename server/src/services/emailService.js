const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendEmail = async ({
    to,
    subject,
    text,
    html
}) => {
    try {
        const mailOptions = {
            from: `"Local Rent Anything" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
    }
};

module.exports = {
    sendEmail
};