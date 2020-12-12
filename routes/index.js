const express = require('express');
const router = express.Router();
const connectDB = require('../database/db');

// get all posts with query passed from client-side
router.get('/posts', async (req, res) => {
  let dbQuery = {};
  let query = req.query;
  if (Object.keys(req.query).length !== 0) {
    dbQuery = {
      price: {
        $gte: parseInt(query.priceLow),
        $lte: parseInt(query.priceHigh),
      },
      area: { $gte: parseInt(query.area) },
      date: { $gte: query.startDate, $lte: query.endDate },
      bedroom: { $gte: query.bedroom.concat('br') },
    };
  }
  const myDB = await connectDB();
  const data = await myDB.getPosts(dbQuery);
  const hotPostIds = await myDB.getViewedHistory();
  for (let i = 0; i < data.length; i++) {
    if (hotPostIds.has(data[i]._id.toString())) {
      data[i].isHot = true;
    }
  }
  res.json(data);
});

// get a single post given its id
router.get('/posts/details/:id', async (req, res) => {
  const myDB = await connectDB();
  let data = await myDB.getSinglePost(req.params.id);
  let comment = null;
  if (req.user && req.user._id) {
    result = await myDB.getPostComment(req.user._id.toString(), req.params.id);
    if (result && result.length > 0) {
      comment = result[0].comment;
    }
    // everytime there's a request sent to '/posts/details/:id'
    // record the userId, postId and timestamp in the viewed collection
    await myDB.addViewedHistory(
      req.params.id,
      req.user._id.toString(),
      req._startTime
    );
  }
  console.log(data);
  if (data.length > 0) {
    data[0].comment = comment;
  }
  // add this comment to the returned single post

  res.json(data);
});

module.exports = router;
