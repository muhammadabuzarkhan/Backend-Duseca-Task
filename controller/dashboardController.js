const dashboardService = require('../services/dashboardService');
const { success, error } = require('../utils/response');

exports.getDashboardSummary = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardSummary();
    return success(res, "Dashboard data fetched successfully", data);
  } catch (err) {
    console.error("Dashboard error:", err);
    return error(res, "Failed to fetch dashboard data");
  }
};
