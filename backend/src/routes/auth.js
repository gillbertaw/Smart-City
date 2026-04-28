const express = require('express');
const router = express.Router();
const { register, login, guestLogin, getForgotQuestion, resetPassword, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestLogin);
router.post('/forgot-password/question', getForgotQuestion);
router.post('/forgot-password/reset', resetPassword);
router.post('/logout', authMiddleware, logout);

module.exports = router;
