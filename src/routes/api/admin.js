const router = require('express').Router();
const { checkAdminToken } = require('../../middlewares/auth.middleware');
const { 
  getAllUsers, 
  deleteUser, 
  toggleBlockUser,
  searchById,
  searchByUsername,
  searchByEmail
} = require('../../controllers/admin.controller');

// GET usuarios
router.get('/users', checkAdminToken, getAllUsers);

// BUSCAR POR ID (único)
router.get('/users/search/id/:id', checkAdminToken, searchById);

// BUSCAR POR USERNAME (único)
router.get('/users/search/username/:username', checkAdminToken, searchByUsername);

// BUSCAR POR EMAIL (único)
router.get('/users/search/email/:email', checkAdminToken, searchByEmail);

// DELETE usuario
router.delete('/users/:id', checkAdminToken, deleteUser);

// BLOQUEAR / DESBLOQUEAR usuario
router.put('/users/:id', checkAdminToken, toggleBlockUser);

module.exports = router;
