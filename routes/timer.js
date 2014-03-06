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

  logger.info('setup timer routes')

  app.get('/api/timer', function (req, res) {
  console.log(req.user.team)
    var query = {}
      , options = {}

    // Add date query if exists
    if(req.query.start && req.query.end){
      query.date = {
        '$gte': JSON.parse(req.query.start)
      , '$lt': JSON.parse(req.query.end)
      }
    }
    // console.log(query)
    // Add Project to query if exists
    if(req.query.project){
      query.project = req.query.project
    }
    // Add Tags to query if exists
    if(req.query.tags && req.query.tags.length !== 0){
      query.tags = req.query.tags
    }

    // Add sort to options if exists
    if(req.query.sort){
      options.sort = req.query.sort
    }
    // Add pagination to options if exists
    if (req.query && req.query.pageSize) {
      options.limit = req.query.pageSize
      if (req.query.page) {
        options.skip = (req.query.page - 1) * req.query.pageSize
      }
    }

    TimerService.list(query, options, function (err, timers) {
      if(err){
        logger.error(err)
        return res.json(err, 400)
      }
      TimerService.count(query, function (err, count) {
        if(err){
          logger.error(err)
          return res.json(err, 400)
        }
        res.json(
          { results: timers
          , page: parseFloat(req.query.page)
          , pageSize: parseFloat(req.query.pageSize)
          , totalItems: count
        })
      })
    })
  })

  app.get('/api/tags', function (req, res) {
    TimerService.tags(req.user.team, function (err, tags) {
      if(err){
        console.log(err)
        return res.json(err, 400)
      }
      console.log(tags)
      return res.json(tags, 201)
    })
  })

  app.get('/api/timer/:timerId', function (req, res) {
    TimerService.detail(req.params.timerId, function (err, timer) {
      if(err) return res.json(err, 400)
      if(req.user.team !== timer.team) return res.json(401)
      return res.json(timer, 201)
    })
  })

  app.post('/api/timer', function (req, res) {
    var data = req.body
    data.user = req.user._id
    data.team = req.user.team
    TimerService.create(data, function (err, timer) {
      if(err){
        logger.error('timer save ERROR', err)
        return res.json(err, 400)
      } else {
        logger.info('timer save SUCCESS', timer)
        return res.json(timer, 201)
      }
      // eventEmitter.emit('timerAdded', timer)
    })
  })

  app.put('/api/timer/:timerId', function (req, res) {
    var data = req.body
    TimerService.update(req.params.timerId, data, function (err, timer) {
      if(err) return res.json(err, 400)
      // eventEmitter.emit('timerAdded', timer)
      return res.json(timer, 201)
    })
  })

  app.delete('/api/timer/:timerId', function (req, res) {
    TimerService.delete(req.params.timerId, function (err) {
      if(err){
        logger.error('timer delete ERROR', err)
        return res.json(err, 400)
      }else{
        logger.info('timer delete SUCCESS', req.params.timerId)
        return res.json(201)
      }
    })
  })

  // app.post('/api/timer/start', function (req, res) {
  //   var data = req.body
  //   data.user = req.user._id
  //   TimerService.create(data, function (err, timer) {
  //     if(err) return res.json(err, 400)
  //     eventEmitter.emit('timerStarted', timer)
  //     res.json(timer, 201)

  //     // Update task model
  //     TaskService.updateActive(timer.task, req.user._id, true, function (err, task) {
  //       console.log(err, task)
  //     })
  //   })
  // })

  // app.post('/api/timer/:timerId/stop', function (req, res) {
  //   TimerService.update(req.params.timerId, {stop: req.body.stop}, function (err, timer) {
  //     if(err) return res.json(err, 400)
  //     eventEmitter.emit('timerStopped', timer)
  //     res.json(timer, 201)

  //     // Update task model
  //     // TaskService.updateActive(timer.task, req.user._id, false, function (err, task) {
  //     //   console.log(err, task)
  //     // })

  //     // Update timer's task model
  //     // TaskService.detail(timer.task, function (err, timers) {
  //     //   totalTime = 0
  //     //   async.eachSeries(timers, function (timer, callback) {
  //     //     var start = new Date(timer.start)
  //     //       , stop = new Date(timer.stop)
  //     //       , total = stop - start

  //     //     totalTime =+ total
  //     //     callback(null) 
  //     //     // console.log(totalTime)
  //     //   }, function (err) {
  //     //     TaskService.update(timer.task, {time: totalTime}, function (err, task) {
  //     //       console.log(err, task)
  //     //     })
  //     //   })
  //     // })
  //   })
  // })
}