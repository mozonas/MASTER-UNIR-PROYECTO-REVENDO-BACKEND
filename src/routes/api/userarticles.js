const express = require('express');
const router = express.Router();
const articlesController = require('../../controllers/article.controller');

router.get('/:userId', articlesController.getAllUserArticles);

module.exports = router;