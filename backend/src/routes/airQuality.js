const router = require('express').Router();
const ctrl = require('../controllers/airQualityController');

router.get('/', ctrl.getAll);
router.get('/:kecamatan', ctrl.getByKecamatan);

module.exports = router;
