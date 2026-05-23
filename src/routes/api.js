const router = require('express').Router();

// Rutas de /api
router.use('/users', require('./api/users'));
router.use('/messages', require('./api/messages'));
router.use('/transactions', require('./api/transactions'))

module.exports = router;