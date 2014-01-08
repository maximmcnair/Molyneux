module.exports = function (app, options) {
  app.get('/', function (req, res) {
    res.render('index')
  })

  app.get('/partials/:name', function (req, res) {
    var name = req.params.name
    res.render('partials/' + name)
  })

  // JSON API
  app.get('/api/name', function (req, res) {
    res.json({
      name: 'Bob'
    })
  })
}