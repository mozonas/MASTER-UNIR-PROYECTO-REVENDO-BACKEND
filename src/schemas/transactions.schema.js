const yup = require('yup');

const comprarSchema = yup.object({
    body: yup.object({
        usuarios_id: yup.number().required().integer().positive()
    })
});

module.exports = {
    comprarSchema
};
