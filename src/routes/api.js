const router = require('express').Router();

// Rutas de /api
router.use('/users', require('./api/users'))

module.exports = router;