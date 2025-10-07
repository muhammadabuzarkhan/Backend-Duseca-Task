// const Post = require('../models/Post');
// const Comment = require('../models/Comment');

// exports.getAuthorsRanked = async () => {
//   return await Post.aggregate([
//     { $group: { _id: "$author", postCount: { $sum: 1 } } },
//     { $sort: { postCount: -1 } }
//   ]);
// };

// exports.getTopCommentedPosts = async () => {
//   return await Comment.aggregate([
//     { $group: { _id: "$postId", commentCount: { $sum: 1 } } },
//     { $sort: { commentCount: -1 } },
//     { $limit: 5 },
//     {
//       $lookup: {
//         from: 'posts',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'post'
//       }
//     },
//     { $unwind: "$post" },
//     {
//       $project: {
//         _id: 0,
//         postId: "$post._id",
//         title: "$post.title",
//         commentCount: 1
//       }
//     }
//   ]);
// };

// exports.getPostsPerDay = async () => {
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
//   return await Post.aggregate([
//     { $match: { createdAt: { $gte: sevenDaysAgo } } },
//     {
//       $group: {
//         _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { _id: 1 } }
//   ]);
// };


// exports.getTotalComments = async () => {
//   return await Comment.countDocuments();
// };

// exports.getCommentsByPostId = async (postId) => {
//   return await Comment.find({ postId }).sort({ createdAt: -1 });
// };

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const client = require('../cache/redisClient'); // ✅ Redis client

// 🧠 Utility function for cache fetching
const getOrSetCache = async (key, ttl, fetchFunction) => {
  const cachedData = await client.get(key);
  if (cachedData) {
    console.log(`Redis Cache Hit → ${key}`);
    return JSON.parse(cachedData);
  }

  console.log(`Redis Cache Miss → ${key}`);
  const freshData = await fetchFunction();
  await client.setEx(key, ttl, JSON.stringify(freshData));
  return freshData;
};

// 🧩 1. Get ranked authors (cache for 60s)
exports.getAuthorsRanked = async () => {
  return await getOrSetCache('authorsRanked', 60, async () => {
    return await Post.aggregate([
      { $group: { _id: "$author", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
    ]);
  });
};

// 🧩 2. Get top commented posts (cache for 60s)
exports.getTopCommentedPosts = async () => {
  return await getOrSetCache('topCommentedPosts', 60, async () => {
    return await Comment.aggregate([
      { $group: { _id: "$postId", commentCount: { $sum: 1 } } },
      { $sort: { commentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: "$post" },
      {
        $project: {
          _id: 0,
          postId: "$post._id",
          title: "$post.title",
          commentCount: 1,
        },
      },
    ]);
  });
};

// 🧩 3. Get posts created per day (last 7 days, cache 120s)
exports.getPostsPerDay = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  return await getOrSetCache('postsPerDay', 120, async () => {
    return await Post.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  });
};

// 🧩 4. Total comment count (cache 30s)
exports.getTotalComments = async () => {
  return await getOrSetCache('totalComments', 30, async () => {
    return await Comment.countDocuments();
  });
};

// 🧩 5. Comments by post (dynamic cache per postId for 30s)
exports.getCommentsByPostId = async (postId) => {
  const cacheKey = `comments:post:${postId}`;
  return await getOrSetCache(cacheKey, 30, async () => {
    return await Comment.find({ postId }).sort({ createdAt: -1 });
  });
};
