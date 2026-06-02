const router = require('express').Router();

const { getAll, create, remove, edit, getById } = require('../../controllers/users.controller');
const { checkUserId } = require('../../middlewares/users.middleware');
const { validateSchema } = require('../../middlewares/validations.middleware');
const { userSchema } = require('../../schemas/users.schema.js');


// Rutas de /api/Users
router.get('/', getAll);
router.get('/:userId', checkUserId, getById);
// router.get('/:userEmail', checkUserId, getByEmail);
router.post('/', validateSchema(userSchema), create);
router.put('/:userId', checkUserId, edit);
router.delete('/:userId', checkUserId, remove);

module.exports = router;