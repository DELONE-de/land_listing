const inquiryService = require('../services/inquiry.service');
const { createInquirySchema, updateInquirySchema, inquiryQuerySchema } = require('../validation/inquiry.validation');

const create = async (req, res, next) => {
  try {
    const data = createInquirySchema.parse(req.body);
    const inquiry = await inquiryService.createInquiry(data);
    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry submitted successfully' });
  } catch (e) { next(e); }
};

const list = async (req, res, next) => {
  try {
    const filters = inquiryQuerySchema.parse(req.query);
    const result = await inquiryService.getInquiries(filters);
    res.json({ success: true, data: result, message: '' });
  } catch (e) { next(e); }
};

const show = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.getInquiryById(req.params.id);
    res.json({ success: true, data: inquiry, message: '' });
  } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const data = updateInquirySchema.parse(req.body);
    const inquiry = await inquiryService.updateInquiry(req.params.id, data);
    res.json({ success: true, data: inquiry, message: 'Inquiry updated successfully' });
  } catch (e) { next(e); }
};

module.exports = { create, list, show, update };
