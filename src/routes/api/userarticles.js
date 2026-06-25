const express = require('express');
const router = express.Router();
const articlesController = require('../../controllers/article.controller');
const { checkAuthToken } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/multer.middleware');

router.use(checkAuthToken);

router.post('/:userId', upload.array('images', 5), articlesController.createArticleHandler);
router.post('/', upload.array('images', 5), articlesController.createArticleHandler);
router.get('/article/:id', articlesController.getById);
router.get('/:userId', articlesController.getAllUserArticles);
router.put('/:articleId', upload.array('images', 5), articlesController.editArticle);
router.delete('/:articleId', articlesController.eraseArticle);

module.exports = router;