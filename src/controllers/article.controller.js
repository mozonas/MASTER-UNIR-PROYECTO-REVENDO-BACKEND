const { getUserArticles } = require('../models/article.model');

const getAllUserArticles = async (req, res) => {
    const userId = req.params.userId;

    try {
        const rawArticles = await getUserArticles(userId);

        return res.status(200).json({
            data: rawArticles
        });
    } catch (error) {
        console.error('Error al obtener los artículos del usuario:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los artículos del usuario'
        });
    }
};

module.exports = {
    getAllUserArticles
};