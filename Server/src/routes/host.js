const router = require('express').Router();
const c = require('../controllers/hostController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect, requireRole('host'));
router.get('/bookings', c.getHostBookings);
router.get('/stats', c.getHostStats);

module.exports = router;