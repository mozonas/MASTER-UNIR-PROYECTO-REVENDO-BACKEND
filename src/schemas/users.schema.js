const yup = require('yup');

/**
 * Esquema de validación para el registro o edición de usuarios
 */
const userSchema = yup.object({
    body: yup.object({
        nombre: yup.string()
            .trim()
            .required('El nombre es obligatorio')
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(50, 'El nombre no puede exceder los 50 caracteres'),

        apellidos: yup.string()
            .trim()
            .required('Los apellidos son obligatorios')
            .min(2, 'Los apellidos deben tener al menos 2 caracteres')
            .max(100, 'Los apellidos no pueden exceder los 100 caracteres'),

        email: yup.string()
            .trim()
            .required('El correo electrónico es obligatorio')
            .email('El formato del correo electrónico no es válido')
            .max(100, 'El correo no puede exceder los 100 caracteres'),

        usuario: yup.string()
            .trim()
            .required('El nombre de usuario es obligatorio')
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .max(30, 'El nombre de usuario no puede exceder los 30 caracteres')
            .matches(/^[a-zA-Z0-9_.]+$/, 'El usuario solo puede contener letras, números, puntos y guiones bajos'),

        password: yup.string()
            .min(4, 'La contraseña debe tener al menos 4 caracteres')
            .max(100, 'La contraseña es demasiado larga')
            .optional()                 // Hace que en el 'edit' no sea obligatoria
            .nullable()                 // Permite valores nulos
            .transform((value) => (value === '' ? null : value)), // Si viene un string vacío '', lo convierte a null

        foto: yup.mixed().notRequired().nullable(),


        perfil: yup.string()
            .oneOf(['USUARIO', 'MODERADOR', 'ADMIN'], 'El perfil seleccionado no es válido')
            .default('USUARIO'),

        fecha_nacimiento: yup.date()
            .nullable()
            .typeError('La fecha de nacimiento debe ser una fecha válida'),

        direccion: yup.string()
            .trim()
            .nullable()
            .max(500, 'La dirección no puede exceder los 500 caracteres')
            .default('')
    })
});

module.exports = {
    userSchema
};