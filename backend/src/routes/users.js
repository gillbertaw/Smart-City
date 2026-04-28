const express = require('express');
const router = express.Router();
const { getProfil, updateProfil, getStatistik } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../config/upload');

router.get('/profil', authMiddleware, getProfil);
router.put('/profil', authMiddleware, upload.single('foto_profil'), updateProfil);
router.get('/statistik', authMiddleware, getStatistik);

module.exports = router;
