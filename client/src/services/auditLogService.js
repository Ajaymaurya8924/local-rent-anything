import api from "../api/axios";

/*
 * Get logged-in user's audit history.
 *
 * Supported filters:
 * - date
 * - from + to
 */
const getMyAuditLogs = async (filters = {}) => {
    try {
        const params = {};

        if (filters.date) {
            params.date = filters.date;
        }

        if (filters.from) {
            params.from = filters.from;
        }

        if (filters.to) {
            params.to = filters.to;
        }

        const response = await api.get(
            "/audit-logs/my",
            { params }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    getMyAuditLogs
};