const express = require('express');

const { User } = require('../server/models');
const auth = require('../authentication');

const router = express.Router();


router.get('/', auth.isAuthenticated, async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.header('X-Total-Count', users.length);
  res.send(users);
});

router.post('/', async (req, res) => {
  const {
    lastname, company, email, password, role,
  } = req.body;
  const user = await auth.register({
    lastname, company, email, password, role,
  });
  res.send(user);
});

router.get('/:id', auth.isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  res.send(userId);
});

router.put('/:id', auth.isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const {
    lastname, company, email, password, role,
  } = req.body;
  const updateUser = await auth.editUser({
    lastname, company, email, password, role, id,
  });
  res.send(updateUser);
});

router.delete('/:id', auth.isAuthenticated, async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.send(id);
});

module.exports = router;
