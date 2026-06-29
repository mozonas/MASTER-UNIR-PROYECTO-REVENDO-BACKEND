const router = require('express').Router();

const { getAll, create, remove, edit, getById, getActiveUsersByMonth, comprar } = require('../../controllers/transactions.controller');
const {checkTransactionId } = require('../../middlewares/transactions.middleware');
const { validateSchema } = require('../../middlewares/validations.middleware');
const { comprarSchema } = require('../../schemas/transactions.schema');


// Rutas de /api/Transactions

router.get('/active-users', getActiveUsersByMonth)

router.post('/comprar/:articleId', validateSchema(comprarSchema), comprar);

router.get('/', getAll);
router.get('/:transactionId', checkTransactionId, getById);
router.post('/', create);
router.put('/:transactionId', checkTransactionId, edit);
router.delete('/:transactionId', checkTransactionId, remove);



module.exports = router;