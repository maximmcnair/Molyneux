var mongoose = require('mongoose')
  , UserModel = require('../models/user.js').UserModel

module.exports.createRoutes = function (app, logger, eventEmitter) {
  logger.info('user routes')

  app.get('/api/user', function (req, res) {
    UserModel.findById(req.user._id, function (err, user) {
      if(err) return res.json(err, 400)
      user.password = user.password.length
      return res.json(user)
    })
  })
}