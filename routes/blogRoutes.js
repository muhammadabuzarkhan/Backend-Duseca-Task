const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');

// Blog CRUD
router.post('/posts', blogController.createPost);
router.post('/posts/:id/comments', blogController.addComment);
router.get('/posts', blogController.getAllPostsWithCommentCount);
router.get('/posts/:id', blogController.getPostById)
router.put('/posts/:id',blogController.updatePost)

// Routes for analytics
const analyticsController = require('../controller/analyticsController');

//Analytics
router.get('/authors', analyticsController.getAuthorsRanked);
router.get('/top-commented', analyticsController.getTopCommentedPosts);
router.get('/posts-per-day', analyticsController.getPostsPerDay);

// Redis-cached comment count for a post
router.get('/comment-count/:id', analyticsController.getCommentCount);
router.get('/comments/total', analyticsController.getTotalComments);
router.get('/posts/:id/comments/all', analyticsController.getCommentsByPostId);

//Dashboard Routes
const dashboardController = require('../controller/dashboardController');
router.get('/dashboard/summary', dashboardController.getDashboardSummary);

// Delete Post
router.delete('/posts/:id', blogController.deletePost)

module.exports = router;
