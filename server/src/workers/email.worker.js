const { Worker } = require("bullmq");

const redis = require("../config/redis");

const {
    sendEmail
} = require("../services/emailService");

const emailWorker = new Worker(
    "localrent-email-queue",
    async (job) => {

        const {
            to,
            subject,
            text,
            html
        } = job.data;

        console.log(
            "Processing email job:",
            job.id
        );

        await sendEmail({
            to,
            subject,
            text,
            html
        });

        console.log(
            "Email job completed:",
            job.id
        );
    },
    {
        connection: redis
    }
);

emailWorker.on("completed", (job) => {
    console.log(
        `Email job ${job.id} completed`
    );
});

emailWorker.on("failed", (job, error) => {
    console.error(
        `Email job ${job?.id} failed:`,
        error.message
    );
});

module.exports = emailWorker;