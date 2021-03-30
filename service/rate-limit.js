const rateLimit = require('express-rate-limit')

const createAccountLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, //30min
  max: 100,
  handler: (_req, res, _next) => {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Too many request. Please try later.',
    })
  },
})

module.exports = { createAccountLimiter }
