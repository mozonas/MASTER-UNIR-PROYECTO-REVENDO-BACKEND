const express = require('express');
const router = express.Router();
const articlesController = require('../../controllers/article.controller');

// When mounted under `/userarticles` from the main router,
// expose the collection at the root path here.
router.get('/', articlesController.getAllUserArticles);

module.exports = router;