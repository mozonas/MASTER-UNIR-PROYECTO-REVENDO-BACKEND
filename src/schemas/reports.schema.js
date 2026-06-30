const yup = require('yup');


const articleReportSchema = yup.object({
    id: yup.number().required().integer(),
    fecha: yup.date().nullable(),
    motivo: yup.string().required(),
    created_at: yup.date().required(),
    titulo: yup.string().required()
});

const chatReportSchema = yup.object({
    id: yup.number().required().integer(),
    fecha: yup.date().nullable(),
    motivo: yup.string().required(),
    created_at: yup.date().required(),
    usuario: yup.string().required(),
    usuarios_id: yup.number().required().integer(),
    articulos_id: yup.number().nullable().integer(),
});


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

const pendingArticleSchema = articleReportSchema.concat(yup.object({
    estado: yup.string().required().oneOf(['pendiente'])
}));

const historyArticleSchema = articleReportSchema.concat(yup.object({
    estado: yup.string().required().oneOf(['activo', 'retirado'])
}));

const pendingChatSchema = chatReportSchema.concat(yup.object({
    estado: yup.string().required().oneOf(['pendiente'])
}));

const historyChatSchema = chatReportSchema.concat(yup.object({
    estado: yup.string().required().oneOf(['activo', 'retirado'])
}));



const pendingArticlesArraySchema = yup.array().of(pendingArticleSchema);
const articlesHistoryArraySchema = yup.array().of(historyArticleSchema);
const pendingChatsArraySchema = yup.array().of(pendingChatSchema);
const chatsHistoryArraySchema = yup.array().of(historyChatSchema);

module.exports = {
    badgeCountersSchema,
    reportArticleSchema,
    pendingArticlesArraySchema,
    articlesHistoryArraySchema,
    pendingChatsArraySchema,
    chatsHistoryArraySchema
};
