const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Smart City Medan API berjalan',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
