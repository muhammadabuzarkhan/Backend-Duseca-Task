

const blogService = require('../services/blogServices');
const { success, error } = require('../utils/response');

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return error(res, "Missing required fields", 400, "validation_error");
    }

    const post = await blogService.createPost({ title, content, author });
    return success(res, "Post created successfully", post, 201);
  } catch (err) {
    console.error("Error in createPost:", err);
    return error(res, "Failed to create post", 500, "server_error", err.message);
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text, commenter } = req.body;
    if (!text || !commenter) {
      return error(res, "Missing required fields", 400, "validation_error");
    }

    const comment = await blogService.addComment(req.params.id, { text, commenter });
    if (!comment) {
      return error(res, "Post not found for adding comment", 404, "not_found");
    }

    return success(res, "Comment added successfully", comment, 201);
  } catch (err) {
    console.error("Error in addComment:", err);
    return error(res, "Failed to add comment", 500, "server_error", err.message);
  }
};

// Get posts with comment count
exports.getAllPostsWithCommentCount = async (req, res) => {
  try {
    const posts = await blogService.getAllPostsWithCommentCount();
    if (!posts || posts.length === 0) {
      return error(res, "No posts found", 404, "not_found");
    }
    return success(res, "Posts with comment count fetched successfully", posts);
  } catch (err) {
    console.error("Error in getAllPostsWithCommentCount:", err);
    return error(res, "Failed to fetch posts", 500, "server_error", err.message);
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await blogService.getPostById(req.params.id);
    if (!post) {
      return error(res, "Post not found", 404, "not_found");
    }
    return success(res, "Post fetched successfully", post);
  } catch (err) {
    console.error("Error in getPostById:", err);
    return error(res, "Failed to fetch post", 500, "server_error", err.message);
  }
};

// Update post by ID
exports.updatePost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Validate
    if (!title && !content && !author) {
      return error(res, "At least one field (title, content, author) is required", 400, "validation_error");
    }

    const updatedPost = await blogService.updatePost(req.params.id, { title, content, author });
    if (!updatedPost) {
      return error(res, "Post not found", 404, "not_found");
    }

    return success(res, "Post updated successfully", updatedPost);
  } catch (err) {
    console.error("Error in updatePost:", err);
    return error(res, "Failed to update post", 500, "server_error", err.message);
  }
};

// Delete post by ID
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await blogService.deletePost(req.params.id);
    if (!deletedPost) {
      return error(res, "Post not found", 404, "not_found");
    }
    return success(res, "Post deleted successfully", deletedPost);
  } catch (err) {
    console.error("Error in deletePost:", err);
    return error(res, "Failed to delete post", 500, "server_error", err.message);
  }
};
