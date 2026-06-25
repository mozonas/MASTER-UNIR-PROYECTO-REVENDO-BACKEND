const router = require('express').Router();

const { checkToken } = require('../middlewares/auth.middleware');


// Rutas de /api
router.use('/users', require('./api/users'));
router.use('/signup', require('./api/signup'));
router.use('/login', require('./api/login'));
router.use('/reports', require('./api/reports'));
router.use('/categories', require('./api/category'));
router.use('/articles', require('./api/article'));
router.use('/user-sell', require('./api/userarticles'));
router.use('/userarticles', require('./api/userarticles'));
//mog 110626 -> Ruta admin
router.use('/admin', require('./api/admin'));

router.use('/article', require('./api/article'));
// router.use('/moderation', require('./api/moderation'));

router.use('/messages', require('./api/messages'));

router.use ('/transactions', require ('./api/transactions'))

//mog 210626 -> filtersHomeV3
router.use ('/filters',require('./api/filters'))

module.exports = router;