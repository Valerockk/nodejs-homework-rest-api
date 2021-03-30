const passport = require('passport')
require('../config/passport')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const header = req.get('Authorization')
    if (!header) {
      return next({
        status: 401,
        message: 'No authorized',
      })
    }
    const [token] = header.split(' ')
    if (!token || err || token !== user.token) {
      return next({
        status: 401,
        message: 'No authorized',
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
