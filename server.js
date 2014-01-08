/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , bunyan = require('bunyan')

// Configure logger
  , logger = bunyan.createLogger({ name: 'MEAN Stack' })

// Load configurations
  , properties = require('./properties')()
  , auth = require('./lib/middleware/auth')
  , mongoose = require('mongoose')

// Bootstrap db connection
  , connection = mongoose.createConnection(properties.db)

// Once connected, set everything up
connection.once('open', function connectionOpen() {
  // Bootstrap models
// ; [ 'user'
//   ].forEach(function (model) {
//     require(__dirname + '/app/models/' + model)(logger, connection)
//   })

  require(__dirname + '/app/models/user')

  var options =
      { logger: logger
      , properties: properties
      }

  // Bootstrap passport config
  require('./lib/passport')(passport, connection, options)

  var app = express()
  var server = require('http').createServer(app);
  var io = require('socket.io').listen(server);

  var pass = require('./auth/passport')
  
  // Express settings
  require('./app')(app, io, logger, passport, connection)


  // Bootstrap routes
  require(__dirname + '/app/controllers/auth')(app, options, passport)
  // require(__dirname + '/app/controllers/home')(app, options)
  require(__dirname + '/app/controllers/user')(app, options)
  require(__dirname + '/app/controllers/api')(app, options)

  // // redirect all others to the index (HTML5 history)
  app.get('*', function (req, res) {
    res.render('index')
  })

  // Socket.io Communication
  io.sockets.on('connection', require('./app/controllers/socket'))

  // Start the app by listening on <port>
  // app.listen(properties.port)
  // use server instead of app.listen @todo
  server.listen(properties.port, function () {
    console.log('Express server listening on port ' + properties.port);
  })

  logger.info('Express app started on port', properties.port)
  logger.info('App is in', properties.environment, 'environment')

  // Expose app
  exports = module.exports = app
})