const router = require('express').Router();
const FiltersController = require('../../controllers/filters.controller');


// GET /api/filters/search
router.get('/search', FiltersController.search);

module.exports = router;
