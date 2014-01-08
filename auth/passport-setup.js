var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , UserModel = require('../models/user.js').UserModel

passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    UserModel.findOne( { accessToken: token }, function (err, existingUser) {
      if (err) { return done( err ); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
        user.set('accessToken', token);
        user.save( function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };

  if ( user._id ) {
    createAccessToken();
  }
})

passport.deserializeUser(function(token, done) {
  UserModel.findOne( {accessToken: token } , function (err, user) {
    done(err, user);
  });
})

passport.use(
  new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    UserModel.findOne({ email: email }, function(err, user) {
      if (err) return done(err)

      if (!user) return done(null, false, { message: 'Unknown user ' + email })

      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err)

        if(isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Invalid password' })
        }
      })
    })
  })
)

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  req.session.initialPath = req.route.path
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}