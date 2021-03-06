/* eslint-env node */
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: "Authorization Failure",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "Authorized",
        username: user.username,
        userId: user._id.toString(),
        adminAccess: user.adminAccess,
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  try {
    req.logOut();
    res.status(200).json({ message: "Log out successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Internal error: ${err}` });
  }
});

module.exports = router;
