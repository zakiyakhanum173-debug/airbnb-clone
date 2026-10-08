const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, default: 1 },
    totalPrice: Number,
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
