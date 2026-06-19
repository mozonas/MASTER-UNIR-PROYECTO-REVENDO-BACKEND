const router = require('express').Router();
const ActivityCont = require ('../../controllers/activity.controller')

router.get('/:range', ActivityCont.getActivity);
module.exports = router