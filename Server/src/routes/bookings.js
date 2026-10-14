const router = require('express').Router();
const c = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, c.createBooking);
router.get('/mine', protect, c.getMyBookings);
router.patch('/:id/cancel', protect, c.cancelBooking);

module.exports = router;