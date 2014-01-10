/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.isAuthenticated()) {
    res.render('index', {
      username: req.user.username
    , avatar: req.user.avatar
    })
  } else {
    res.redirect('/login')
  }
}

exports.partials = function (req, res) {
  var name = req.params.name
  res.render('partials/' + name)
}