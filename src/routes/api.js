const router = require('express').Router();

const { checkToken } = require('../middlewares/auth.middleware');


// Rutas de /api
router.use('/users', require('./api/users'));
router.use('/signup', require('./api/signup'));
//router.post('/login', login);

//router.use('/messages', require('./api/messages'));
//router.use('/transactions', require('./api/transactions'))
// 30052026 - F4eature Login/SignUp




module.exports = router;