const express = require('express');
const router = express.Router();
const trashController = require('../controllers/trashController');

router.get('/', trashController.getAll);
router.get('/:kecamatan', trashController.getByKecamatan);

module.exports = router;