module.exports.ensureAuthenticated = function (serviceLocator) {

  return function (req, res, next) {
    if (req.isAuthenticated()) {
      serviceLocator.logger.info('Authenticated ', req.user.email);
      return next();
    }
    res.redirect('/login');
  }
}