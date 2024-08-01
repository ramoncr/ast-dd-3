const express = require('express');
const router = express.Router();
const db = require('./../models')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await db.users.findAll({});
  res.render('users', users);
});

module.exports = router;