const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getAuthorsRanked = async () => {
  return await Post.aggregate([
    { $group: { _id: "$author", postCount: { $sum: 1 } } },
    { $sort: { postCount: -1 } }
  ]);
};

exports.getTopCommentedPosts = async () => {
  return await Comment.aggregate([
    { $group: { _id: "$postId", commentCount: { $sum: 1 } } },
    { $sort: { commentCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: '_id',
        as: 'post'
      }
    },
    { $unwind: "$post" },
    {
      $project: {
        _id: 0,
        postId: "$post._id",
        title: "$post.title",
        commentCount: 1
      }
    }
  ]);
};

exports.getPostsPerDay = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  return await Post.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};


exports.getTotalComments = async () => {
  return await Comment.countDocuments();
};

exports.getCommentsByPostId = async (postId) => {
  return await Comment.find({ postId }).sort({ createdAt: -1 });
};