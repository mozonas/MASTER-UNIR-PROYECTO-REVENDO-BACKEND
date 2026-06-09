const yup = require('yup');

const badgeCountersSchema = yup.object({
    pendingArticlesCount: yup.number().required().integer().min(0),
    pendingChatsCount: yup.number().required().integer().min(0)
});

module.exports = { badgeCountersSchema };
