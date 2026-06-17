const router = require('express').Router();

const { checkToken } = require('../middlewares/auth.middleware');


// Rutas de /api
router.use('/users', require('./api/users'));
router.use('/signup', require('./api/signup'));
router.use('/login', require('./api/login'));
router.use('/reports', require('./api/reports'));
router.use('/user-sell', require('./api/userarticles'));
router.use('/userarticles', require('./api/userarticles'));
//mog 110626 -> Ruta admin
router.use('/admin', require('./api/admin'));

router.use('/article', require('./api/article'));
router.use ('/transactions', require ('./api/transactions'))
// router.use('/moderation', require('./api/moderation'));

//router.use('/messages', require('./api/messages'));



module.exports = router;