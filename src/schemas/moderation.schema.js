const ModerationSchema = {

    badgesCounters: {
        pendingArticlesCount: { type: 'number', required: true, min: 0 },
        pendingChatsCount: { type: 'number', required: true, min: 0 }
    },

    validateAndShapeCounters: (rawArticles, rawChats) => {
        let articles = rawArticles;
        let chats = rawChats;

        if (articles < 0) {
            articles = 0;
        }
        if (chats < 0) {
            chats = 0;
        }

        return {
            pendingArticlesCount: articles,
            pendingChatsCount: chats
        };
    }
};

module.exports = ModerationSchema;