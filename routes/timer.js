var TimerService = require('../controllers/timer')
  , TaskService = require('../controllers/task')
  , async = require('async')

module.exports.createRoutes = function (app, logger, eventEmitter) {
  // TimerService.create({
  //   title: 'Email auth'
  // , description: 'Allow users to signup with email address and password'
  // , project: 1
  // , _id: '52d3d6422b0e53da86c1e9ac'
  // }, function (err, project) {
  //   console.log(project)
  // })
  // TimerService.list('1', function (err, timers) {
  //   console.log(timers)
  // })
  // TimerService.detail('52d3d6422b0e53da86c1e9ac', function (err, timer) {
  //   console.log(err, timer)
  // })
  // TimerService.update('52d3d6422b0e53da86c1e9ac', {title: 'User Auth'}, function (err, timer) {
  //   console.log(err, timer)
  // })
  // TimerService.delete('52d3d6422b0e53da86c1e9ac', function (err) {
  //   console.log(err)
  // })
  // TimerService.list('1', function (err, timers) {
  //   console.log(timers)
  // })


  app.get('/api/timer/:timerId', function (req, res) {
    TimerService.detail(req.params.timerId, function (err, timer) {
      if(err) return res.json(err, 400)
      return res.json(timer, 201)
    })
  })

  app.post('/api/timer/', function (req, res) {
    var data = req.body
    data.user = req.user._id
    TimerService.create(data, function (err, timer) {
      if(err) return res.json(err, 400)
      eventEmitter.emit('timerAdded', timer)
      return res.json(timer, 201)
    })
  })

  app.post('/api/timer/start', function (req, res) {
    var data = req.body
    data.user = req.user._id
    TimerService.create(data, function (err, timer) {
      if(err) return res.json(err, 400)
      eventEmitter.emit('timerStarted', timer)
      return res.json(timer, 201)
    })
  })

  app.post('/api/timer/:timerId/stop', function (req, res) {
    TimerService.update(req.params.timerId, {stop: req.body.stop}, function (err, timer) {
      if(err) return res.json(err, 400)
      eventEmitter.emit('timerStopped', timer)
      res.json(timer, 201)

      // Update timer's task model
      TimerService.list(timer.task, function (err, timers) {
        totalTime = 0
        async.eachSeries(timers, function (timer, callback) {
          var start = new Date(timer.start)
            , stop = new Date(timer.stop)
            , total = stop - start

          totalTime =+ total
          callback(null) 
          // console.log(totalTime)
        }, function (err) {
          TaskService.update(timer.task, {time: totalTime}, function (err, task) {
            console.log(err, task)
          })
        })
      })
    })
  })
}