const express = require('express');
const bcrypt = require('bcrypt');
const withDb = require('../database/dbUtils');

const router = express.Router();

// register a new user
router.post('/register', async (req, res) => {
  try {
    await withDb(async (db) => {
      console.log(req.body);
      const hashedPwd = await bcrypt.hash(req.body.password, 10);
      console.log(hashedPwd);
      await db.collection('users').insertOne({
        username: req.body.username,
        email: req.body.email,
        password: hashedPwd,
        adminAccess: false,
        savelist: [],
      });
    });

    res.status(200).json({ message: 'The user is registered successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Internal Error: ${err}` });
  }
});

// // update the user's saved post list
// router.post("/updateSaveList", async (req, res, next) => {

// });

module.exports = router;
