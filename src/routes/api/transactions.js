const router = require('express').Router();

const { getAll, create, remove, edit, getById, getByYear } = require('../../controllers/transactions.controller');
const {checkTransactionId } = require('../../middlewares/transactions.middleware');
const { validateSchema } = require('../../middlewares/validations.middleware');


// Rutas de /api/Transactions
router.get('/anual', getByYear);

router.get('/', getAll);
router.get('/:transactionId', checkTransactionId, getById);
router.post('/', create);
router.put('/:transactionId', checkTransactionId, edit);
router.delete('/:transactionId', checkTransactionId, remove);



module.exports = router;