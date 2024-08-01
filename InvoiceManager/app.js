const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const invoiceRouter = require("./routes/invoice");
const pdfRouter = require("./routes/api/export");
const ccRouter = require("./routes/api/cc");
const authRouter = require("./routes/auth");
const notificationsRouter = require("./routes/api/notifications");
const pluginsRouter = require("./routes/api/plugins");
const { ensureAuthenticatedRequest } = require("./utils");

// Setup database
const db = require("./models/");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Setup express
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      httpOnly: false,
    },
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new SQLiteStore({ db: "db.sqlite", dir: "./" }),
  })
);
app.use(passport.authenticate("session"));

app.use("/", authRouter);
app.use("/", ensureAuthenticatedRequest(), indexRouter);
app.use("/users", ensureAuthenticatedRequest(), usersRouter);
app.use("/invoice", ensureAuthenticatedRequest(), invoiceRouter);
app.use("/api/export", ensureAuthenticatedRequest(), pdfRouter);
app.use('/api/notifications', ensureAuthenticatedRequest(), notificationsRouter);
app.use("/api/cc", ensureAuthenticatedRequest(), ccRouter);
app.use("/api/plugins", ensureAuthenticatedRequest(), pluginsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
