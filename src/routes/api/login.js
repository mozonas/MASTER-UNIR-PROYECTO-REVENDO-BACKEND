const router = require('express').Router();

const { login, profile, getClientes } = require('../../controllers/login.controller');


router.post('/', login);
module.exports = router;