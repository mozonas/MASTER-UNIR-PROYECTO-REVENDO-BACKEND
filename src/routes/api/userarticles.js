const express = require('express');
const router = express.Router();
const userarticlesController = require('../../controllers/userarticles.controller');

router.get('/user/:userId', userarticlesController.getUserArticles);

module.exports = router;