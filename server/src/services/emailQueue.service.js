const { Queue } = require("bullmq");
const redis = require("../config/redis");

const emailQueue = new Queue(
    "localrent-email-queue",
    {
        connection: redis
    }
);

const addEmailJob = async ({
    to,
    subject,
    text,
    html
}) => {
    const job = await emailQueue.add(
        "send-email",
        {
            to,
            subject,
            text,
            html
        }
    );

    console.log("Email job added:", job.id);

    return job;
};

module.exports = {
    emailQueue,
    addEmailJob
};