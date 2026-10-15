const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// GET /api/host/bookings : mere listings pe aayi bookings
exports.getHostBookings = async (req, res, next) => {
  try {
    const myListings = await Listing.find({ host: req.user._id }).select('_id');
    const bookings = await Booking.find({ listing: { $in: myListings.map((l) => l._id) } })
      .populate('listing', 'title city')
      .populate('guest', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) { next(err); }
};

// GET /api/host/stats
exports.getHostStats = async (req, res, next) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).select('_id avgRating reviewCount');
    const ids = listings.map((l) => l._id);
    const confirmed = await Booking.find({ listing: { $in: ids }, status: 'confirmed' }).select('totalPrice');

    const earnings = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const rated = listings.filter((l) => l.reviewCount > 0);
    const avgRating = rated.length
      ? Math.round((rated.reduce((s, l) => s + l.avgRating, 0) / rated.length) * 10) / 10
      : 0;

    res.json({
      totalListings: listings.length,
      totalBookings: confirmed.length,
      earnings,
      avgRating,
    });
  } catch (err) { next(err); }
};