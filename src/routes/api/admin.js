const router = require('express').Router();
const { checkAdminToken } = require('../../middlewares/auth.middleware');
const { getAllUsers} = require('../../controllers/admin.controller');

// Rutas de /api/admin
router.get('/users', checkAdminToken, getAllUsers);

//router.delete('/users/:userId', checkAdminToken, deleteUser);

module.exports = router;