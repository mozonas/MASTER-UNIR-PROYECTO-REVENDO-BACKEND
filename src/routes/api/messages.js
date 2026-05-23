const router = require('express').Router();

const { getAll, create, remove, edit, getById } = require('../../controllers/messages.controller');
const { checkClienteId } = require('../../middlewares/messages.middleware');
const { validateSchema } = require('../../middlewares/validation.middleware');
const { clienteSchema } = require('../../schemas/messages.schema');

// Rutas de /api/Messages
router.get('/', getAll);
router.get('/:messageId', checkMessageId, getById);
router.post('/', validateSchema(messageSchema), create);
router.put('/:messageId', checkMessageId, edit);
router.delete('/:messageId', checkMessageId, remove);

module.exports = router;