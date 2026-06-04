const express = require('express');
const router = express.Router();
const userarticlescontroller= require('../controllers/userarticles.controller');

router.get('/user/:userId', userarticlescontroller.getUserArticles);

module.exports = router;