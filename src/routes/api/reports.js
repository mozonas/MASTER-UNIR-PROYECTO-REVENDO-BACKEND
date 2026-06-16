const express = require('express');
const router = express.Router();

const reportsController = require('../../controllers/reports.controller');

router.get('/badges-counters', reportsController.getBadgesCounters);
router.post('/report-article/:articleId', reportsController.reportArticle);
router.get('/articles-in-review', reportsController.getArticlesInReview);
router.put('/resolve/:reporteId', reportsController.resolveReport);

module.exports = router;
