const router = require('express').Router();
const ctrl = require('../controllers/facilityController');

router.get('/', ctrl.getAll);

module.exports = router;
