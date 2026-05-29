/* 
1. Imprortar la libreria de validaciones
2. Definir las reglas de validación para cada campo del articulo
(titulo, descripcion, precio, estadoVenta, estadoProducto, ubicación, tipoEntrega, tipoPago)
3. Exportar el esquema de validación para ser utilizado en las rutas
*/

// 1. Imprortar la libreria de validaciones
const Joi = require('joi');

// 2. Definir las reglas de validación para cada campo del articulo
const articleSchema = Joi.object({
    titulo: Joi.string().max(100).required(),
    ubicación: Joi.string().max(100).required(), // Confirmar que el campo se llama ubicación
    descripcion: Joi.string().required(),
    precio: Joi.number().positive().required(),
    usuarios_id: Joi.number().integer().positive().required(),
    categorias_id: Joi.number().integer().positive().required(),
});


// 3. Exportar el esquema de validación para ser utilizado en las rutas
module.exports = articleSchema;
