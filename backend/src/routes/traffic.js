const router = require('express').Router();
const ctrl = require('../controllers/trafficController');

router.get('/', ctrl.getAll);
router.get('/summary', ctrl.getSummary);

module.exports = router;
