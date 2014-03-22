module.exports.createRoutes = function (app, logger) {
  logger.info('landing routes')

  app.get('/pricing', function (req, res) {
    res.render('landing/pricing')
  })
  app.get('/mailing-list', function (req, res) {
    res.render('landing/mailing-list')
  })
}