const router = require('express').Router();

const { register} = require('../../controllers/users.controller');
const { validateSchema } = require('../../middlewares/validations.middleware');
const { userSchema } = require('../../schemas/users.schema');

// Rutas de /api/Users

router.post('/', validateSchema(userSchema), register);


module.exports = router;