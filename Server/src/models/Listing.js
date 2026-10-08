const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    pricePerNight: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, index: true },
    address: String,
    lat: Number,
    lng: Number,
    images: [String],
    maxGuests: { type: Number, default: 1, min: 1 },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'cabin', 'room'],
      default: 'apartment',
    },
    amenities: [String],
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
