const AuditLog = require("../models/auditLog.model");
const User = require("../models/user.model");

// =====================================================
// CREATE AUDIT LOG
// =====================================================

const createAuditLog = async ({
    user,
    action,
    entityType,
    entityId = null,
    description,
    metadata = {}
}) => {

    const auditLog = await AuditLog.create({
        user,
        action,
        entityType,
        entityId,
        description,
        metadata
    });

    return auditLog;
};


// =====================================================
// GET MY AUDIT LOGS
// =====================================================

const getMyAuditLogs = async (userId) => {

    const logs = await AuditLog.find({
        user: userId
    })
        .populate(
            "user",
            "fullName email role"
        )
        .sort({ createdAt: -1 })
        .lean();

    return logs;
};


// =====================================================
// GET ALL AUDIT LOGS - ADMIN
// =====================================================

const getAllAuditLogs = async ({
    search = "",
    action = "",
    entityType = ""
} = {}) => {

    const query = {};

    // Action filter
    if (action) {
        query.action = action;
    }

    // Entity type filter
    if (entityType) {
        query.entityType = entityType;
    }

    const logs = await AuditLog.find(query)
        .populate(
            "user",
            "fullName email role"
        )
        .sort({ createdAt: -1 })
        .lean();

    // Search populated user fields + description
    if (search && search.trim()) {

        const searchText =
            search.trim().toLowerCase();

        return logs.filter((log) => {

            const userName =
                log.user?.fullName?.toLowerCase() || "";

            const userEmail =
                log.user?.email?.toLowerCase() || "";

            const description =
                log.description?.toLowerCase() || "";

            const actionText =
                log.action?.toLowerCase() || "";

            const entityText =
                log.entityType?.toLowerCase() || "";

            return (
                userName.includes(searchText) ||
                userEmail.includes(searchText) ||
                description.includes(searchText) ||
                actionText.includes(searchText) ||
                entityText.includes(searchText)
            );
        });
    }

    return logs;
};


module.exports = {
    createAuditLog,
    getMyAuditLogs,
    getAllAuditLogs
};