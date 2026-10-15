require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Listing = require('./src/models/Listing');
const Booking = require('./src/models/Booking');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const guest = await User.findOne({ email: 'guest@test.com' });
  const listing = await Listing.findOne({ city: 'Goa' });
  if (!guest || !listing) {
    console.log('Guest ya listing nahi mili');
    process.exit(1);
  }
  const b = await Booking.create({
    listing: listing._id,
    guest: guest._id,
    checkIn: new Date('2026-09-01'),
    checkOut: new Date('2026-09-04'),
    guests: 1,
    totalPrice: 3 * listing.pricePerNight,
  });
  console.log('✅ Past booking bani. Listing ID:', listing._id.toString());
  process.exit(0);
})();