const yup = require('yup');

const articleSchema = yup.object({
    body: yup.object({
        id: yup.string().required(),
        titulo: yup.string().required(),
        descripcion: yup.string().max(200),
        precio: yup.number().positive().required(),
        estadoVenta: yup.string().oneOf(['DISPONIBLE', 'VENDIDO', 'RESERVADO']).required(),
        createdAt: yup.date().required(),
    })
});

module.exports = {
    articleSchema
};