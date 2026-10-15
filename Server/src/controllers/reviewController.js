const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Listing = require('../models/Listing');

// Listing ki avgRating aur reviewCount dobara calculate karo
const recalcRating = async (listingId) => {
  const [stats] = await Review.aggregate([
    { $match: { listing: new mongoose.Types.ObjectId(listingId) } },
    { $group: { _id: '$listing', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Listing.findByIdAndUpdate(listingId, {
    avgRating: stats ? Math.round(stats.avg * 10) / 10 : 0,
    reviewCount: stats ? stats.count : 0,
  });
};

// GET /api/listings/:id/reviews  (public)
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.id })
      .populate('guest', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) { next(err); }
};

// GET /api/listings/:id/can-review  (logged in)
// Frontend ko batata hai ki review form dikhana hai ya nahi
exports.canReview = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      listing: req.params.id,
      guest: req.user._id,
      status: 'confirmed',
      checkOut: { $lt: new Date() },
    }).select('_id');
    const reviewed = await Review.find({ booking: { $in: bookings.map((b) => b._id) } }).select('booking');
    const reviewedIds = new Set(reviewed.map((r) => r.booking.toString()));
    const eligible = bookings.find((b) => !reviewedIds.has(b._id.toString()));
    res.json({ canReview: !!eligible });
  } catch (err) { next(err); }
};

// POST /api/listings/:id/reviews  (guest, completed stay)
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment = '' } = req.body;
    const r = Number(rating);
    if (!r || r < 1 || r > 5) return res.status(400).json({ message: 'Rating must be 1 to 5' });

    const bookings = await Booking.find({
      listing: req.params.id,
      guest: req.user._id,
      status: 'confirmed',
      checkOut: { $lt: new Date() },
    }).select('_id');
    if (bookings.length === 0) {
      return res.status(403).json({ message: 'You can only review completed stays' });
    }

    const reviewed = await Review.find({ booking: { $in: bookings.map((b) => b._id) } }).select('booking');
    const reviewedIds = new Set(reviewed.map((x) => x.booking.toString()));
    const booking = bookings.find((b) => !reviewedIds.has(b._id.toString()));
    if (!booking) return res.status(409).json({ message: 'You already reviewed this stay' });

    const review = await Review.create({
      listing: req.params.id,
      guest: req.user._id,
      booking: booking._id,
      rating: r,
      comment: String(comment).trim(),
    });
    await recalcRating(req.params.id);
    res.status(201).json(review);
  } catch (err) { next(err); }
};