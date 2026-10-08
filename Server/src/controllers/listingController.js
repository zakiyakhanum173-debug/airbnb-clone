const Listing = require('../models/Listing');

exports.getListings = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, guests, type, page = 1, limit = 12 } = req.query;
    const q = {};
    if (city) q.city = new RegExp(city.trim(), 'i');
    if (type) q.type = type;
    if (guests) q.maxGuests = { $gte: Number(guests) };
    if (minPrice || maxPrice) {
      q.pricePerNight = {};
      if (minPrice) q.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) q.pricePerNight.$lte = Number(maxPrice);
    }
    const p = Math.max(1, Number(page));
    const l = Math.min(50, Number(limit));
    const [items, total] = await Promise.all([
      Listing.find(q).sort('-createdAt').skip((p - 1) * l).limit(l),
      Listing.countDocuments(q),
    ]);
    res.json({ items, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) { next(err); }
};

exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) { next(err); }
};

exports.createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body, host: req.user._id });
    res.status(201).json(listing);
  } catch (err) { next(err); }
};

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    const { host, avgRating, reviewCount, ...safe } = req.body;
    Object.assign(listing, safe);
    await listing.save();
    res.json(listing);
  } catch (err) { next(err); }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) { next(err); }
};

exports.getMyListings = async (req, res, next) => {
  try {
    res.json(await Listing.find({ host: req.user._id }).sort('-createdAt'));
  } catch (err) { next(err); }
};