const Post = require('../models/Post');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

exports.getDashboardSummary = async () => {
  // 1. Posts per day (last 7 days)
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

  // Map Mongo day numbers (1 = Sunday, 7 = Saturday)
  const dayMap = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const dailyCounts = dayMap.map((day, i) => {
    const match = postsPerDay.find(p => p._id === i+1);
    return { day, count: match ? match.count : 0 };
  });

  const todayPosts = dailyCounts[new Date().getDay()].count;

  // 2. Comments per week (last 4 weeks)
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

  const totalComments = await Comment.countDocuments();

  return {
    postsPerDay: {
      today: todayPosts,
      last7DaysChange: 15, // you can calculate growth %
      dailyCounts
    },
    commentsOverTime: {
      total: totalComments,
      last30DaysChange: 8, // placeholder %, can be calculated
      weeklyCounts
    }
  };
};
