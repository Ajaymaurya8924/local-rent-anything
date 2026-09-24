const express = require("express");

const router = express.Router();

const {
    getMyAuditLogsController,
    getAllAuditLogsController
} = require("../controllers/auditLog.controller");

const {
    verifyToken,
    verifyAdmin
} = require("../middlewares/auth.middleware");


// =====================================================
// MY ACTIVITY HISTORY
// =====================================================

router.get(
    "/my",
    verifyToken,
    getMyAuditLogsController
);


// =====================================================
// ALL AUDIT LOGS - ADMIN ONLY
// =====================================================

router.get(
    "/all",
    verifyToken,
    verifyAdmin,
    getAllAuditLogsController
);


module.exports = router;