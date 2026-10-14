const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

const DAY = 24 * 60 * 60 * 1000;

const fail = (status, message) => Object.assign(new Error(message), { status });

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  const { listingId, checkIn, checkOut, guests = 1 } = req.body;
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (!listingId || isNaN(start) || isNaN(end) || end <= start) {
    return res.status(400).json({ message: 'Invalid dates' });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    return res.status(400).json({ message: 'Cannot book dates in the past' });
  }

  const session = await mongoose.startSession();
  try {
    let booking;
    await session.withTransaction(async () => {
      const listing = await Listing.findById(listingId).session(session);
      if (!listing) throw fail(404, 'Listing not found');
      if (listing.host.equals(req.user._id)) throw fail(400, 'You cannot book your own listing');
      if (Number(guests) > listing.maxGuests) {
        throw fail(400, `Maximum ${listing.maxGuests} guests allowed`);
      }

      const conflict = await Booking.findOne({
        listing: listingId,
        status: 'confirmed',
        checkIn: { $lt: end },
        checkOut: { $gt: start },
      }).session(session);
      if (conflict) throw fail(409, 'These dates are no longer available');

      const nights = Math.round((end - start) / DAY);
      [booking] = await Booking.create(
        [{
          listing: listingId,
          guest: req.user._id,
          checkIn: start,
          checkOut: end,
          guests: Number(guests),
          totalPrice: nights * listing.pricePerNight,
        }],
        { session }
      );
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  } finally {
    session.endSession();
  }
};

// GET /api/bookings/mine
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('listing', 'title city images pricePerNight')
      .sort('-checkIn');
    res.json(bookings);
  } catch (err) { next(err); }
};

// PATCH /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.checkIn <= new Date()) {
      return res.status(400).json({ message: 'Cannot cancel a stay that has started' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};

// GET /api/listings/:id/bookings  (public: sirf dates, calendar ke liye)
exports.getListingBookedDates = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      listing: req.params.id,
      status: 'confirmed',
      checkOut: { $gt: new Date() },
    }).select('checkIn checkOut -_id');
    res.json(bookings);
  } catch (err) { next(err); }
};