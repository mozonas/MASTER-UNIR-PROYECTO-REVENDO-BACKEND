/*
1. Importar el esquema de validación de articulos
2. Crear una funcion intermedia para comprobar que los datos enviados por la API sean correctos
3. Si los datos son correctos, continuar con la siguiente funcion (controlador)
4. Si los datos son incorrectos, enviar un mensaje de error al cliente
5. Exportar la funcion intermedia para ser utilizada en las rutas
*/

// 1. Importar el esquema de validación de articulos
const articleSchema = require('../schemas/article.schema');

// 2. Crear una funcion intermedia para comprobar que los datos enviados por la API sean correctos
const validateArticle = (req, res, next) => {
    console.log('Validando datos del articulo...');
    const { error } = articleSchema.validate(req.body);
    console.warn('Resultado de la validación:', error);
    if (error) {
// 4. Si los datos son incorrectos, enviar un mensaje de error al cliente
        const errorDetails = error.details.map(detail => detail.message);
        console.warn('Errores de validación:', errorDetails);

        return res.status(400).json({
             status: 'error',
                message: 'Datos de articulo no válidos',
                errors: errorDetails
            });
        }
// 3. Si los datos son correctos, continuar con la siguiente funcion (controlador)
        console.log('Datos del articulo válidos. Continuando con el controlador...');
        next();
};

// 5. Exportar la funcion intermedia para ser utilizada en las rutas
module.exports = validateArticle;


