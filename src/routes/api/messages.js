const router = require('express').Router();

const { getByArticulo, getByUsuario, getById, create, remove } = require('../../controllers/messages.controller');
const { checkMessageId } = require('../../middlewares/messages.middleware');
const { validateSchema } = require('../../middlewares/validations.middleware');
const { messageSchema } = require('../../schemas/messages.schema');

// Rutas de /api/Messages
router.get('/articulo/:articuloId', getByArticulo);
router.get('/usuario/:usuarioId', getByUsuario);
router.get('/:messageId', checkMessageId, getById);
router.post('/', validateSchema(messageSchema), create);
router.delete('/:messageId', checkMessageId, remove);

module.exports = router;