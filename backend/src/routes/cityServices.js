const router = require('express').Router();
const upload = require('../config/upload');
const { authMiddleware } = require('../middleware/auth');
const ctrl = require('../controllers/cityServiceController');

router.use(authMiddleware);
router.get('/', ctrl.overview);
router.get('/water-detail', ctrl.waterDetail);
router.post('/floods', upload.single('foto'), ctrl.createFlood);
router.post('/policies/:id/vote', ctrl.votePolicy);
router.get('/threads', ctrl.threads);
router.post('/threads', ctrl.createThread);
router.post('/threads/:id/comments', ctrl.createComment);
router.post('/reports', upload.single('foto'), ctrl.createReport);

module.exports = router;
