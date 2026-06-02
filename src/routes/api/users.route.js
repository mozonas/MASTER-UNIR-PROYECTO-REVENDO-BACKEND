const router = require('express').Router();

// 1. Importamos los controladores
const {
    getAll,
    getById,
    getByEmail,
    create,
    edit,
    remove
} = require('../../controllers/users.controller');

// 2. Importamos los middlewares
const { checkUserId } = require('../../middlewares/users.middleware');
const { validateSchema } = require('../../middlewares/validations.middleware');
const { userSchema } = require('../../schemas/users.schema'); // Unificado a 'userSchema'

// Rutas base: /api/usuarios

// Obtener todos los usuarios
router.get('/', getAll);

// Obtener un usuario por ID (Utiliza el middleware para validar que exista antes de entrar)
router.get('/por-id/:userId', checkUserId, getById);

// Obtener un usuario por Email (Quitamos checkUserId porque aquí el parámetro es un string/email, no un ID entero)
router.get('/por-email/:userEmail', getByEmail);

// Crear un nuevo usuario (Valida el esquema de datos antes de registrar en DB)
router.post('/', validateSchema(userSchema), create);

// Actualizar un usuario por completo
router.put('/:userId', checkUserId, edit);

// Eliminar un usuario físicamente
router.delete('/:userId', checkUserId, remove);

module.exports = router;