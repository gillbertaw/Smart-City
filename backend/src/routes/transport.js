const router = require('express').Router();
const ctrl = require('../controllers/transportController');

router.get('/', ctrl.getRoutes);
router.get('/:id', ctrl.getRouteWithSchedules);

module.exports = router;
