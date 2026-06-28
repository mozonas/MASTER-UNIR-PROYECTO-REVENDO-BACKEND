const router = require('express').Router();
const { getAll, create, remove, edit, getById, getStatistics, getValoraciones, getUsersStats } = require('../../controllers/users.controller');
const { checkUserId } = require('../../middlewares/users.middleware');

const { validateSchema } = require('../../middlewares/validations.middleware');
const { userSchema } = require('../../schemas/users.schema.js');

const upload = require('../../middlewares/multer.middleware');

// Rutas de /api/Users
router.get('/stats/users', getUsersStats); 
router.post('/', validateSchema(userSchema), create);
router.get('/', getAll);
router.get('/:userId', checkUserId, getById);
// router.get('/:userEmail', checkUserId, getByEmail);
// router.put('/:userId', checkUserId, upload.single('foto'), edit); 
// router.put('/:userId', upload.single('foto'), checkUserId, edit);
// Si en el futuro validas el esquema en el PUT, el orden estricto debe ser:
router.put('/:userId', upload.single('foto'), validateSchema(userSchema), checkUserId, edit);

router.delete('/:userId', checkUserId, remove);

router.get('/:userId/estadisticas', checkUserId, getStatistics);
router.get('/:userId/valoraciones', checkUserId, getValoraciones);

module.exports = router;