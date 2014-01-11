/**
 * Module dependencies
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , file = require('./routes/file')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//========================================================
//  User Auth
//========================================================
var mongoose = require('mongoose')
  , passport = require('passport')
  , pass = require('./auth/passport')
  , config = require('./config')

//Connect to database
mongoose.connect( config.db[app.settings.env] )

mongoose.connection.on('error', function(err) {
  console.log( 'connection error: ' + err)
})

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());

// Express/Mongo session storage
app.use(express.session({
  secret: config.session.secret,
  store: new MongoStore({
    db: 'molyneux-api'
  , collection: 'sessions'
  })
}))

// app.use( express.cookieSession({
//   secret: 'b73=-#K|:>#[#xzK^4&4"^>6m-{)8> ?:]{>r<{o%*)1V1D3;-s4<2)I-@&10/:;^*!6}$v+C|2n*%5K57)]4=1:14%64=r-,M&'
// , maxAge: 360*5
// }) )

app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
// User passport.js for authentication
app.use( passport.initialize() )
app.use( passport.session() )

//perform route lookup based on url and HTTP method
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */


require('./controllers/team')

// serve index and view partials
app.get('/', routes.index)
app.get('/partials/:name', routes.partials)

// JSON API
app.post('/api/file/upload', file.upload)

// Basic auth routes
app.get('/login', function (req, res) {
  res.render('login')
})
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err)
      res.redirect('/')
    }

    // if (!user) {
    //   console.log(err)
    //   return res.send(401)
    // }

    req.logIn(user, function(err) {
      if (err) {
        console.log(err)
        res.redirect('/')
      }

      console.log('Login success: ', user)
      // res.json({
      //   name: user.username
      // , email: user.email
      // })
      res.redirect('/')
    })
  })(req, res, next)
})
app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
var cookie = require("cookie")
var connect = require('connect')


var passportSocketIo = require("passport.socketio")

io.set('authorization', passportSocketIo.authorize({
  cookieParser: express.cookieParser,
  key:         'connect.sid',
  secret:      config.session.secret,
  store: new MongoStore({
    db: 'molyneux-api'
  , collection: 'sessions'
  }),
  success:     onAuthorizeSuccess,
  fail:        onAuthorizeFail,
}))

io.configure('production', function(){
  io.enable('browser client etag');
  io.set('log level', 1);

  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function(){
  io.set('transports', ['websocket']);
});

io.sockets.on('connection', require('./routes/socket'))

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');

  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  console.log(data)
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);

  // We use this callback to log all of our failed connections.
  accept(null, false);
}
/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
