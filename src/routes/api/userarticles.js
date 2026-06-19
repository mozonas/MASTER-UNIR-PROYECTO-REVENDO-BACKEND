const express = require('express');
const router = express.Router();
const articlesController = require('../../controllers/article.controller');

router.get('/:userId', articlesController.getAllUserArticles);
router.put('/:articleId', articlesController.editArticle);
router.delete('/:articleId', articlesController.eraseArticle);

module.exports = router;