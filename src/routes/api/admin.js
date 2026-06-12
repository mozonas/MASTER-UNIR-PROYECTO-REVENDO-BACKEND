const router = require('express').Router();
const { checkAdminToken } = require('../../middlewares/auth.middleware');
const { getAllUsers, deleteUser, toggleBlockUser } = require('../../controllers/admin.controller');

// GET usuarios
router.get('/users', checkAdminToken, getAllUsers);

// DELETE usuario
router.delete('/users/:id', checkAdminToken, deleteUser);

// BLOQUEAR / DESBLOQUEAR usuario
router.put('/users/:id', checkAdminToken, toggleBlockUser);

module.exports = router;
