var passport = require('passport')
  , UserModel = require('../models/user').UserModel

module.exports.createRoutes = function (app, logger) {
  // Basic auth routes
  app.get('/team', function (req, res) {
    res.render('team')
  })
  app.get('/login', function (req, res) {
    res.render('auth/login')
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

  app.get('/signup', function (req, res) {
    res.render('auth/signup', {err: ''});
  })
  app.post('/signup', function(req, res, next){
    logger.info('Signup attempt', req.body)
    if(req.body.password === req.body.repeatPassword){
      if(req.body.email !== '' && req.body.password !== '' && req.body.name !== ''){

        var usr = new UserModel({
            username: req.body.name
          , email: req.body.email
          , password: req.body.password
          , team: '52d155ed8d94e2e235000001'
          , admin: false
        })

        usr.save(function(err) {
          if(err) {
            logger.error('Signup attempt:', err)
            res.render('auth/signup', {err: 'email', email:req.body.email, message: 'Email is already in use'})
          } else {
            logger.info('Signup success, user: ' + usr.name + " saved.")
            // emailTemplate( 'welcome.jade', {
            //   subject: 'Welcome to Talllies'
            // , email: usr.email
            // , name: usr.username
            // , action: {
            //     link: 'http://tallli.es/login'
            //   , title: 'Login Now'
            //   }
            // })
            // email({
            //   from: 'Talllies Time Tracking <webmaster@tallli.es>'
            // , to: 'webmaster@tallli.es'
            // , html: 'name: ' + usr.name + ', email: ' + usr.email
            // , subject: 'New signup on talllies'
            // }, function(err){
            //   if (err)
            //     logger.error('Signup attempt:', err)
            // })
            req.login(usr, function(err) {
              if (err)
                logger.error('Signup attempt:', err)
              return res.redirect('/')
            })
          }
        })
      }
    } else {
      res.render('auth/signup', {err: 'password', message: 'Passwords must be the same.'})
    }
  })


}