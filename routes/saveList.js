const express = require('express');
const router = express.Router();
const connectDB = require('../database/db');

// get the user's one specific record in the savelist given postId
router.get('/', async (req, res, next) => {
  const myDB = await connectDB();
  let data = await myDB.getSaveList(req.user._id.toString(), req.body.postId);
  res.json(data);
});

// update the user's one specific post comment with postId and new comment
router.put('/', async (req, res, next) => {
  const myDB = await connectDB();
  let data = await myDB.updateOneComment(
    req.user._id.toString(),
    req.body.postId,
    req.body.comment
  );
  res.json(data);
});

// delete the user's comment for one post
router.delete('/', async (req, res, next) => {
  const myDB = await connectDB();
  let data = await myDB.deleteOneComment(
    req.user._id.toString(),
    req.body.postId
  );
  console.log(data);
  res.json(data);
});

module.exports = router;
