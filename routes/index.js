var express = require('express');
var router = express.Router();
const connectDB = require('../database/db');

// get all posts without any filter
router.get('/posts', async (req, res) => {
  console.log('entered');
  const myDB = await connectDB();
  const data = await myDB.getPosts();
  res.json(data);
});

// get a particular post
router.get('posts/details/:id', async (req, res) => {
  const myDB = await connectDB();
  const postID = req.postID;
  const data = await myDB.getSinglePost(postID);
  res.json(data);
});

module.exports = router;
