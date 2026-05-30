const router = require('express').Router();

// Rutas de /api
router.use('/users', require('./api/users'));
router.use('/messages', require('./api/messages'));
router.use('/transactions', require('./api/transactions'))
// 30052026 - F4eature Login/SignUp
router.use('/login', require('./api/login'));
router.use('/signup', require('./api/signup'));

module.exports = router;