const { countPendingArticles, countPendingChats } = require('../models/moderation.model');
const ModerationSchema = require('../schemas/moderation.schema');

const getBadgesCounters = async (req, res) => {
    try {
        const rawArticles = await countPendingArticles();
        const rawChats = await countPendingChats();

        const validatedCounters = ModerationSchema.validateAndShapeCounters(rawArticles, rawChats);
        res.json(validatedCounters);

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los contadores de badges en panel de moderación'
        });
    }
};

module.exports = { getBadgesCounters };
