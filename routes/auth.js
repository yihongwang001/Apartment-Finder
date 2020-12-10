const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        message: 'Authorization Failure',
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Authorized',
        username: user.username,
        userId: user._id.toString(),
      });
    });
  })(req, res, next);
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login?msg='Error auth'",
//   }),
//   function (req, res) {
//     console.log("Logged in", req.body);
//     res.redirect("/");
//   }
// );

// router.get("/getUser", (req, res) =>
//   res.send({ username: req.user ? req.user.username : null })
// );

router.get('/logout', (req, res) => {
  try {
    req.logOut();
    res.status(200).json({ message: 'Log out successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Internal error: ${err}` });
  }
});

// router.get('/authenticated', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.status(200).json({ authenticated: true });
//   } else {
//     res.status(200).json({ authenticated: false });
//   }
// });

module.exports = router;
