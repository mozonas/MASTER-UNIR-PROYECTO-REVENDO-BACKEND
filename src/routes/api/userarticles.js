const express = require('express');
const router = express.Router();
const articlesController = require('../../controllers/article.controller');

router.post('/:userId', articlesController.createArticleHandler);
router.post('/', articlesController.createArticleHandler);
router.get('/article/:id', articlesController.getById);
router.get('/:userId', articlesController.getAllUserArticles);
router.put('/:articleId', articlesController.editArticle);
router.delete('/:articleId', articlesController.eraseArticle);

module.exports = router;