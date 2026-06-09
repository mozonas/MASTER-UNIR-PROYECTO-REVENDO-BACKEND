const router = require('express').Router();

const { checkToken } = require('../middlewares/auth.middleware');


// Rutas de /api
router.use('/users', require('./api/users'));
router.use('/signup', require('./api/signup'));
router.use('/login', require('./api/login'));

//router.use('/messages', require('./api/messages'));

router.use ('/transactions', require ('./api/transactions'))




module.exports = router;