

// const Post = require('../models/Post');
// const Comment = require('../models/Comment');

// // Create a post
// exports.createPost = async (data) => {
//   const post = new Post(data);
//   return await post.save();
// };

// // Add a comment to a post
// exports.addComment = async (postId, data) => {
//   const comment = new Comment({ ...data, postId });
//   return await comment.save();
// };

// // Get all posts with comment count
// exports.getAllPostsWithCommentCount = async () => {
//   return await Post.aggregate([
//     {
//       $lookup: {
//         from: 'comments',
//         localField: '_id',
//         foreignField: 'postId',
//         as: 'comments',
//       },
//     },
//     {
//       $addFields: {
//         commentCount: { $size: '$comments' },
//       },
//     },
//     {
//       $project: { comments: 0 },
//     },
//     { $sort: { createdAt: -1 } },
//   ]);
// };

// // Add paginated, filtered posts function
// exports.getPostsPaginated = async (query, page = 1, limit = 10) => {
//   const filter = {};
//   if (query.author) filter.author = query.author;
//   if (query.title) filter.title = { $regex: query.title, $options: 'i' };

//   return await Post.aggregate([
//     { $match: filter },
//     {
//       $lookup: {
//         from: 'comments',
//         localField: '_id',
//         foreignField: 'postId',
//         as: 'comments',
//       },
//     },
//     {
//       $addFields: {
//         commentCount: { $size: '$comments' },
//       },
//     },
//     { $project: { comments: 0 } },
//     { $sort: { createdAt: -1 } },
//     { $skip: (page - 1) * limit },
//     { $limit: limit },
//   ]);
// };



// exports.getPostById = async (id) => {
//   return await Post.findById(id);
// };

// exports.updatePost = async (id, data) => {
//   return await Post.findByIdAndUpdate(id, data, { new: true });
// };
// exports.deletePost = async (id) => {
//   return await Post.findByIdAndDelete(id);
// };

const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a post
exports.createPost = async (data) => {
  const post = new Post(data);
  return await post.save();
};

// Add a comment to a post
exports.addComment = async (postId, data) => {
  const comment = new Comment({ ...data, postId });
  return await comment.save();
};

// Get all posts with comment count and pagination
exports.getPostsPaginated = async (query, page = 1, limit = 5) => {
  const filter = {};
  if (query.author) filter.author = query.author;
  if (query.title) filter.title = { $regex: query.title, $options: 'i' };

  const totalPosts = await Post.countDocuments(filter);

  const posts = await Post.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
      $addFields: {
        commentCount: { $size: '$comments' },
      },
    },
    { $project: { comments: 0 } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  return {
    page,
    limit,
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
    posts,
  };
};

// Get all posts with comment count (no pagination)
exports.getAllPostsWithCommentCount = async () => {
  return await Post.aggregate([
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
      $addFields: {
        commentCount: { $size: '$comments' },
      },
    },
    { $project: { comments: 0 } },
    { $sort: { createdAt: -1 } },
  ]);
};

exports.getPostById = async (id) => {
  return await Post.findById(id);
};

exports.updatePost = async (id, data) => {
  return await Post.findByIdAndUpdate(id, data, { new: true });
};

exports.deletePost = async (id) => {
  return await Post.findByIdAndDelete(id);
};
