const dashboardService = require('../services/dashboardService');
const { success, error } = require('../utils/response');

exports.getDashboardSummary = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardSummary();
    return success(res, "Dashboard summary fetched successfully", data);
  } catch (err) {
    console.error("Dashboard error:", err);
    return error(res, "Failed to fetch dashboard data", 500, "server_error", err.message);
  }
};
