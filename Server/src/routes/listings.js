const router = require('express').Router();
const c = require('../controllers/listingController');
const b = require('../controllers/bookingController');
const r = require('../controllers/reviewController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', c.getListings);
router.get('/mine', protect, requireRole('host'), c.getMyListings);
router.get('/:id/bookings', b.getListingBookedDates);
router.get('/:id/reviews', r.getReviews);
router.get('/:id/can-review', protect, r.canReview);
router.post('/:id/reviews', protect, r.addReview);
router.get('/:id', c.getListing);
router.post('/', protect, requireRole('host'), c.createListing);
router.put('/:id', protect, requireRole('host'), c.updateListing);
router.delete('/:id', protect, requireRole('host'), c.deleteListing);

module.exports = router;
