const listingService = require('../services/listing.service');
const { createListingSchema, updateListingSchema, listingQuerySchema } = require('../validation/listing.validation');
const{generateListingPDF} = require('../lib/pdfGenerator')

const list = async (req, res, next) => {
  try {
    const filters = listingQuerySchema.parse(req.query);
    const result = await listingService.getListings(filters);
    res.json({ success: true, data: result, message: '' });
  } catch (e) { next(e); }
};

const show = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    res.json({ success: true, data: listing, message: '' });
  } catch (e) { next(e); }
};

const showBySlug = async (req, res, next) => {
  try {
    const listing = await listingService.getListingBySlug(req.params.slug);
    res.json({ success: true, data: listing, message: '' });
  } catch (e) { next(e); }
};

const related = async (req, res, next) => {
  try {
    const listings = await listingService.getRelatedListings(req.params.id);
    res.json({ success: true, data: listings, message: '' });
  } catch (e) { next(e); }
};

const locations = async (req, res, next) => {
  try {
    const data = await listingService.getLocations();
    res.json({ success: true, data, message: '' });
  } catch (e) { next(e); }
};

const landTypes = async (req, res, next) => {
  try {
    const data = await listingService.getLandTypes();
    res.json({ success: true, data, message: '' });
  } catch (e) { next(e); }
};

const amenities = async (req, res, next) => {
  try {
    const data = await listingService.getAmenities();
    res.json({ success: true, data, message: '' });
  } catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try {
    const data = createListingSchema.parse(req.body);
    const listing = await listingService.createListing(data);
    res.status(201).json({ success: true, data: listing, message: 'Listing created successfully' });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const data = updateListingSchema.parse(req.body);
    const listing = await listingService.updateListing(req.params.id, data);
    res.json({ success: true, data: listing, message: 'Listing updated successfully' });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await listingService.deleteListing(req.params.id);
    res.json({ success: true, data: null, message: 'Listing deleted successfully' });
  } catch (e) { next(e); }
};

const trackView = async (req, res, next) => {
  try {
    await listingService.trackView(req.params.id);
    res.json({ success: true, data: null, message: 'View tracked' });
  } catch (e) { next(e); }
};

const trackClick = async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!type) {
      const err = new Error('Click type is required');
      err.status = 400;
      throw err;
    }
    await listingService.trackClick(req.params.id, type);
    res.json({ success: true, data: null, message: 'Click tracked' });
  } catch (e) { next(e); }
};


const generateListingPDFController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find listing by ID
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    // Generate PDF
    const pdfBuffer = await generateListingPDF({
      title: listing.title,
      price: listing.price,
      location: listing.location,
      description: listing.description,
      images: listing.images || []
    });
    
    // Create safe filename
    const filename = `${listing.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${id}.pdf`;
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};

module.exports = {
  generateListingPDFController
};



module.exports = { list, show, showBySlug, related, locations, landTypes, amenities, create, update, remove, trackView, trackClick,generateListingPDFController};
