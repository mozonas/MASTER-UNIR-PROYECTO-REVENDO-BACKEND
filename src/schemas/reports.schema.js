const yup = require('yup');

const badgeCountersSchema = yup.object({
    pendingArticlesCount: yup.number().required().integer().min(0),
    pendingChatsCount: yup.number().required().integer().min(0)
});

const reportArticleSchema = yup.object({
    body: yup.object({
        motivo: yup.string().required().min(5).max(500),
        usuarioId: yup.number().required().integer().positive()
    })
});

module.exports = { badgeCountersSchema, reportArticleSchema };
