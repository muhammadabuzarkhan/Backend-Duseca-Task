const analyticsService = require('../services/analyticsService');
const { success, error } = require('../utils/response');

exports.getAuthorsRanked = async (req, res) => {
  try {
    const data = await analyticsService.getAuthorsRanked();
    if (!data || data.length === 0) {
      return error(res, "No authors found", null, 404);
    }
    return success(res, "Authors ranked fetched successfully", data);
  } catch (err) {
    console.error("Error in getAuthorsRanked:", err);
    return error(res, "Failed to fetch authors ranked", err.message, 500);
  }
};

exports.getTopCommentedPosts = async (req, res) => {
  try {
    const data = await analyticsService.getTopCommentedPosts();
    if (!data || data.length === 0) {
      return error(res, "No commented posts found", null, 404);
    }
    return success(res, "Top commented posts fetched successfully", data);
  } catch (err) {
    console.error("Error in getTopCommentedPosts:", err);
    return error(res, "Failed to fetch top commented posts", err.message, 500);
  }
};

exports.getPostsPerDay = async (req, res) => {
  try {
    const data = await analyticsService.getPostsPerDay();
    if (!data || data.length === 0) {
      return error(res, "No posts found for the given days", null, 404);
    }
    return success(res, "Posts per day fetched successfully", data);
  } catch (err) {
    console.error("Error in getPostsPerDay:", err);
    return error(res, "Failed to fetch posts per day", err.message, 500);
  }
};

exports.getCommentCount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return error(res, "Post ID is required", null, 400);
    }

    const count = await analyticsService.getCommentCountCached(id);
    if (count === null) {
      return error(res, "Post not found", null, 404);
    }

    return success(res, "Comment count fetched successfully", {
      postId: id,
      commentCount: count,
    });
  } catch (err) {
    console.error("Error in getCommentCount:", err);
    return error(res, "Failed to fetch comment count", err.message, 500);
  }
};


exports.getTotalComments = async (req, res) => {
  try {
    const total = await analyticsService.getTotalComments();
    return success(res, "Total comments fetched successfully", { totalComments: total });
  } catch (err) {
    console.error("Error in getTotalComments:", err);
    return error(res, "Failed to fetch total comments", 500, "server_error", err.message);
  }
};


exports.getCommentsByPostId = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await analyticsService.getCommentsByPostId(id);

    if (!comments || comments.length === 0) {
      return error(res, "No comments found for this post", 404, "not_found");
    }

    return success(res, "Comments fetched successfully", comments);
  } catch (err) {
    console.error("Error in getCommentsByPostId:", err);
    return error(res, "Failed to fetch comments");
  }
};