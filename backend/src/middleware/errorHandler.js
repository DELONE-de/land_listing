const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err instanceof ZodError) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error', 
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
  }
  
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
};

module.exports = errorHandler;
