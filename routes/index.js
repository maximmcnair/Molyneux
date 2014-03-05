/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.isAuthenticated()) {
    res.render('app', {
      username: req.user.username
    , userId: req.user._id
    , avatar: req.user.avatar
    })
  } else {
    res.render('index')
  }
}

exports.partials = function (req, res) {
  var name = req.params.name
  res.render('partials/' + name)
}