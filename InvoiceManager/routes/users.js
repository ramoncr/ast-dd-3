const express = require('express');
const router = express.Router();
const db = require('./../models')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await db.users.findAll({ raw: true});
  console.log(users);
  res.render('users', { users });
});

/* GET user by id. */
router.get('/:id', async function(req, res, next) {
  const user = await db.users.findByPk(req.params.id, { raw: true });
  res.render('user', { ...user, isAdmin: user.isAdmin == 1, disableInputs: req.user.isAdmin == 0 });
});

/* POST user by id. */
router.post('/:id', async function(req, res, next) { 
  const body = req.body;

  const user = await db.users.findByPk(req.params.id, { raw: true });
  if(!user) 
    return res.status(404).send('User not found');

  user.name = body.name;
  user.email = body.email;
  user.isAdmin = (body.isAdmin == 'on');

  db.users.update(user, { where: { id: req.params.id }});
  return res.redirect('/users');
});

module.exports = router;