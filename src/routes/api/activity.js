const router = require('express').Router();
const ActivityCont = require ('../../controllers/activity.controller')

router.get('/daily', ActivityCont.getDaily);
router.get('/weekly', ActivityCont.getWeekly);
router.get('/monthly', ActivityCont.getMonthly);

module.exports = router