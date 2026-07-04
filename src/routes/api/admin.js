const router = require('express').Router();
const { checkAdminToken } = require('../../middlewares/auth.middleware');
const { 
  getAllUsers, 
  deleteUser, 
  toggleBlockUser,
  searchById,
  searchByUsername,
  searchByEmail,
  getCategoriesPaginated,
  createCategory,
  updateCategory,
  deleteCategory,
  blockUserFromReport
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

// MOG 02072026 ->bloquear usuario desde reporte
router.put('/users/block/:id', checkAdminToken, blockUserFromReport);



//CATEGORÍAS
// ===============================
//        CATEGORÍAS (ADMIN)
// ===============================

// LISTAR categorías (paginado)
router.get('/categories', checkAdminToken, getCategoriesPaginated);

// CREAR categoría
router.post('/categories', checkAdminToken, createCategory);

// ACTUALIZAR categoría
router.put('/categories/:id', checkAdminToken, updateCategory);

// ELIMINAR categoría
router.delete('/categories/:id', checkAdminToken, deleteCategory);

module.exports = router;
