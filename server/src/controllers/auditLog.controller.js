const {
    getMyAuditLogs,
    getAllAuditLogs
} = require("../services/auditLog.service");


// =====================================================
// GET MY AUDIT LOGS
// =====================================================

const getMyAuditLogsController = async (
    req,
    res
) => {

    try {

        const userId = req.user._id;

        const logs =
            await getMyAuditLogs(userId);

        return res.status(200).json({
            success: true,
            message: "Activity history fetched successfully",
            data: {
                logs,
                totalLogs: logs.length
            }
        });

    } catch (error) {

        console.error(
            "My Audit Logs Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch activity history"
        });
    }
};


// =====================================================
// GET ALL AUDIT LOGS - ADMIN
// =====================================================

const getAllAuditLogsController = async (
    req,
    res
) => {

    try {

        const search =
            req.query.search || "";

        const action =
            req.query.action || "";

        const entityType =
            req.query.entityType || "";

        const logs =
            await getAllAuditLogs({
                search,
                action,
                entityType
            });

        return res.status(200).json({
            success: true,
            message: "Audit logs fetched successfully",
            data: {
                logs,
                totalLogs: logs.length
            }
        });

    } catch (error) {

        console.error(
            "All Audit Logs Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs"
        });
    }
};


module.exports = {
    getMyAuditLogsController,
    getAllAuditLogsController
};