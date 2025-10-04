const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Dashboard Summary
exports.getDashboardSummary = async () => {
  // ===== Total Stats =====
  const totalPosts = await Post.countDocuments();
  const totalComments = await Comment.countDocuments();

  // Count distinct authors
  const totalAuthorsAgg = await Post.aggregate([
    { $group: { _id: "$author" } },
    { $count: "authors" }
  ]);
  const totalAuthors = totalAuthorsAgg.length > 0 ? totalAuthorsAgg[0].authors : 0;

  // ===== Posts per Day (last 7 days) =====
  const postsPerDay = await Post.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 }
      }
    }
  ]);

  // Map days
  const dayMap = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dailyCounts = dayMap.map((day, i) => {
    const match = postsPerDay.find(p => p._id === i+1);
    return { day, count: match ? match.count : 0 };
  });

  const todayPosts = dailyCounts[new Date().getDay()].count;

  // ===== Comments Over Time (last 4 weeks) =====
  const commentsOverTime = await Comment.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $week: "$createdAt" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  const weeklyCounts = commentsOverTime.map((c, i) => ({
    name: `Week ${i + 1}`,
    comments: c.count
  }));

  return {
    totalPosts,
    totalComments,
    totalAuthors,
    postsPerDay: {
      today: todayPosts,
      last7DaysChange: 18, // TODO: replace with real % growth if needed
      dailyCounts
    },
    commentsOverTime: {
      total: totalComments,
      last30DaysChange: 12, // TODO: replace with real % growth if needed
      weeklyCounts
    }
  };
};
