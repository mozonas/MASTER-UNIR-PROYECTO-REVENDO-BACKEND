const { getAll, getArticleById } = require('../models/article.model');

const getAllUserArticles = async (req, res) => {
    try {
        const rawArticles = await getAll();

        return res.status(200).json({
            status: 'success',
            data: rawArticles
        });
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los artículos'
        });
    }
};

const getById = async (req, res) => {
     try {
        const { id } = req.params;
        const rawArticle = await getArticle(id);

        return res.status(200).json({
            status: 'success',
            data: rawArticle
        });
    } catch (error) {
        console.error('Error al obtener el artículo:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el artículo'
        });
    } 
};

module.exports = {
    getAllUserArticles,
    getById
};