const Report = require('../models/reports.model');
const { badgeCountersSchema } = require('../schemas/reports.schema');


const ReportsController = {
    getBadgesCounters: async (req, res) => {
        try {
            const rawArticles = await Report.countPendingArticles();
            const rawChats = await Report.countPendingChats();

            const rawCounters = {
                pendingArticlesCount: rawArticles,
                pendingChatsCount: rawChats
            };

            const validatedCounters = badgeCountersSchema.cast(rawCounters);

            res.json(validatedCounters);
        } catch (error) {
            console.error('Error al obtener los contadores de badges:', error);
            res.status(500).json({ error: 'Error al obtener los contadores de badges' });
        }
    }
};

module.exports = ReportsController;

