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
  res.json(data);
});

// get a single post given its id
router.get('/posts/details/:id', async (req, res) => {
  const myDB = await connectDB();
  const data = await myDB.getSinglePost(req.params.id);
  res.json(data);
});

module.exports = router;
