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
});


const badgeCountersSchema = yup.object({
    pendingArticlesCount: yup.number().required().integer().min(0),
    pendingChatsCount: yup.number().required().integer().min(0)
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
    pendingArticlesArraySchema,
    articlesHistoryArraySchema,
    pendingChatsArraySchema,
    chatsHistoryArraySchema
};
