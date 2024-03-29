var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , UserModel = require('../app/models/user.js').UserModel

UserModel.findOne({ email: 'bob@synthmedia.co.uk'}, function (err, doc){
 if(doc === null){
    var newUser = new UserModel({
      username: 'bob'
    , email: 'bob@synthmedia.co.uk'
    , password: 'cheese cake'
    , admin: true
    })
    newUser.save(function (err, user) {
      if(err) console.log(err)
      console.log(user)
    })
  }
})

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user)
  })
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
  // req.session.initialPath = req.route.path
  if ( req.isAuthenticated() ) {
    console.log('200')
    next()
  } else {
    console.log('401')
    res.send(401)
  }
}