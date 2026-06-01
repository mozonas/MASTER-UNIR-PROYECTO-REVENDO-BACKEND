const router = require('express').Router();

const { getAll, create, remove, edit, getById } = require('../../controllers/transactions.controller');
const { checkClienteId } = require('../../middlewares/transactions.middleware');
const { validateSchema } = require('../../middlewares/validations.middleware');
const { transactionSchema } = require('../../schemas/transaction.schema');

// Rutas de /api/Transactions
router.get('/', getAll);
router.get('/:transactionId', checkTransactionId, getById);
router.post('/', validateSchema(transactionSchema), create);
router.put('/:transactionId', checkTransactionId, edit);
router.delete('/:transactionId', checkTransactionId, remove);

module.exports = router;