const router = require('express').Router();

const { getAll, create, remove, edit, getById } = require('../../controllers/users.controller');
const { checkClienteId } = require('../../middlewares/users.middleware');
const { validateSchema } = require('../../middlewares/validation.middleware');
const { clienteSchema } = require('../../schemas/users.schema');

// Rutas de /api/Users
router.get('/', getAll);
router.get('/:userId', checkUserId, getById);
router.get('/:userEmail', checkUserId, getByEmail);
router.post('/', validateSchema(userSchema), create);
router.put('/:userId', checkUserId, edit);
router.delete('/:userId', checkUserId, remove);

module.exports = router;