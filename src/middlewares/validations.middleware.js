// src/middlewares/validation.middleware.js

const validateSchema = (schema) => {
    return async (req, res, next) => {
        try {
            // Validamos el body de la petición usando el esquema de Yup
            if (schema.body) {
                req.body = await schema.body.validate(req.body, { abortEarly: false, stripUnknown: true });
            }
            next();
        } catch (error) {
            // Si Yup encuentra errores, los devuelve en un array ordenado
            return res.status(400).json({ 
                message: 'Error de validación en los datos enviados',
                errors: error.errors || error.message 
            });
        }
    };
};

// ⚠️ LA CLAVE ESTÁ AQUÍ: Exportar con llaves para que coincida con las rutas
module.exports = {
    validateSchema
};