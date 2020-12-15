/* eslint-env node */

const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const ObjectID = require("mongodb").ObjectID;

const withDb = require("../database/dbUtils");

function configPassport(app) {
  const localVerify = async (email, password, done) => {
    let user;
    await withDb(async (db) => {
      user = await db.collection("users").findOne({ email: email });
    });
    if (user == null) {
      return done(null, false, {
        message: "Cannot find user with this email.",
      });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect." });
      }
    } catch (err) {
      console.log(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, localVerify));

  // serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });
  passport.deserializeUser(async (id, done) => {
    let user;
    await withDb(async (db) => {
      user = await db.collection("users").findOne({ _id: ObjectID(id) });
    });
    return done(null, user);
  });

  // tell app to use this passport
  app.use(require("body-parser").urlencoded({ extended: true }));
  app.use(
    require("express-session")({
      //   secret: process.env.SESSION_SECRET,
      secret: "This is my key",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // a testing url
  app.get("/session-test", (req, res) => {
    if (req.user) {
      res.status(200).json({
        username: req.user.username,
        user_id: req.user._id.toString(),
      });
    } else {
      res.status(200).json({
        username: "session is not working",
        user_id: "session is not working",
      });
    }
  });
}

module.exports = configPassport;
