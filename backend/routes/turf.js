const express = require('express');
const TurfController = require('../controllers/turfController');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', TurfController.getTurf);
router.put('/', verifyAdmin, TurfController.updateTurf);

module.exports = router;
