const router = require('express').Router();

const { create} = require('../../controllers/users.controller');
const { checkUserId } = require('../../middlewares/users.middleware');
const { validateSchema } = require('../../middlewares/validation.middleware');
const { userSchema } = require('../../schemas/users.schema');

// Rutas de /api/Users

router.post('/', validateSchema(userSchema), create);


module.exports = router;