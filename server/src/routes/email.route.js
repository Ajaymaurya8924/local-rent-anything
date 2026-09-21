const express = require("express");

const router = express.Router();

const {
    testEmail
} = require("../controllers/email.controller");

router.post("/test", testEmail);

module.exports = router;