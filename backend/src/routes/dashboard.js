const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');

router.get('/stats', ctrl.getCityStats);
router.get('/overview', ctrl.getOverview);

module.exports = router;
