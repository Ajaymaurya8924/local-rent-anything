const {
    addEmailJob
} = require("../services/emailQueue.service");

const testEmail = async (req, res) => {
    try {
        const { to } = req.body;

        if (!to) {
            return res.status(400).json({
                success: false,
                message: "Recipient email is required"
            });
        }

        await addEmailJob({
            to,
            subject: "Local Rent Anything - Queue Test",
            text: "Redis email queue is working successfully!",
            html: `
        <h2>Local Rent Anything</h2>
        <p>Redis email queue is working successfully! ✅</p>
    `
        });

        res.status(200).json({
            success: true,
            message: "Test email sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    testEmail
};