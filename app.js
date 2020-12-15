/* eslint-env node */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const busboy = require("connect-busboy");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const saveListRouter = require("./routes/saveList");

const configPassport = require("./utils/authConfig.js");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "react_app/build")));
app.use(busboy());

configPassport(app);

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/savelist", saveListRouter);

module.exports = app;
