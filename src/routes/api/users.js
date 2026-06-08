const router = require('express').Router();
const { getAll, create, remove, edit, getById, getStatistics } = require('../../controllers/users.controller');
const { checkUserId } = require('../../middlewares/users.middleware');

const { validateSchema } = require('../../middlewares/validations.middleware');
const { userSchema } = require('../../schemas/users.schema.js');

const upload = require('../../middlewares/multer.middleware'); 

// Rutas de /api/Users
router.get('/', getAll);
router.get('/:userId', checkUserId, getById);
// router.get('/:userEmail', checkUserId, getByEmail);
router.post('/', validateSchema(userSchema), create);
router.put('/:userId', checkUserId, upload.single('foto'), edit); 
router.delete('/:userId', checkUserId, remove);

router.get('/:userId/estadisticas', checkUserId, getStatistics);

module.exports = router;