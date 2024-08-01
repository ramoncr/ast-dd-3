const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");

const iv = "cf83e1357eefb8bd";

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db.users
      .findAll({
        where: {
          username: username,
        },
      })
      .then((result) => {
        if (result.length !== 1) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        const user = result[0];

        const cipher = crypto.createDecipheriv(user.strategy, user.salt, iv);
        const buffer = Buffer.from(user.password, "base64");
        const cipherhered =
          (cipher.update(buffer.toString("utf8"), "hex", "utf8"),
          cipher.final("utf8"));

        if (cipherhered === password) {
          return cb(null, user);
        }

        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      })
      .catch((err) => {
        return cb(err);
      });
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup", function (req, res, next) {
  const strategy = "aes-256-cbc";
  const salt = crypto.createHash("sha512").digest("hex").substring(0, 32);
  const cipher = crypto.createCipheriv(strategy, salt, iv);

  const hashedPassword = Buffer.from(
    cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");

  db.users
    .create({
      username: req.body.username,
      password: hashedPassword,
      salt,
      strategy,
    })
    .then(() => {
      res.redirect("/");
    });
});

module.exports = router;
