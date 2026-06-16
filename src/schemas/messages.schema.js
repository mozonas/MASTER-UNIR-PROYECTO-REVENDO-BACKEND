const yup = require('yup');

/**
 * Esquema de validación para la creación de mensajes
 */
const messageSchema = yup.object({
    body: yup.object({
        contenido: yup.string()
            .trim()
            .required('El contenido del mensaje es obligatorio')
            .min(1, 'El mensaje no puede estar vacío')
            .max(1000, 'El mensaje no puede exceder los 1000 caracteres'),

        usuarios_id: yup.number()
            .required('El ID del usuario es obligatorio')
            .positive('El ID del usuario debe ser un número positivo')
            .integer('El ID del usuario debe ser un número entero'),

        articulos_id: yup.number()
            .required('El ID del artículo es obligatorio')
            .positive('El ID del artículo debe ser un número positivo')
            .integer('El ID del artículo debe ser un número entero')
    })
});

module.exports = {
    messageSchema
};