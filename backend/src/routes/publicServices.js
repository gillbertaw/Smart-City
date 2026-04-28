const router = require('express').Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const ctrl = require('../controllers/publicServiceController');

router.use(authMiddleware);
router.get('/', ctrl.overview);
router.patch('/alerts/:id', adminMiddleware, ctrl.toggleAlert);

module.exports = router;
