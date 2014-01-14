var TaskService = require('../controllers/task')
  , TimerService = require('../controllers/timer')

module.exports.createRoutes = function (app, logger, eventEmitter) {
  logger.info('task routes')

  // TaskService.create({
  //   title: 'Email auth'
  // , description: 'Allow users to signup with email address and password'
  // , project: 1
  // , _id: '52d3d6422b0e53da86c1e9ac'
  // }, function (err, project) {
  //   console.log(project)
  // })
  // TaskService.list('1', function (err, tasks) {
  //   console.log(tasks)
  // })
  // TaskService.detail('52d3d6422b0e53da86c1e9ac', function (err, task) {
  //   console.log(err, task)
  // })
  // TaskService.update('52d3d6422b0e53da86c1e9ac', {title: 'User Auth'}, function (err, task) {
  //   console.log(err, task)
  // })
  // TaskService.delete('52d3d6422b0e53da86c1e9ac', function (err) {
  //   console.log(err)
  // })
  // TaskService.list('1', function (err, tasks) {
  //   console.log(tasks)
  // })


  app.get('/api/tasks/:taskId', function (req, res) {
    TaskService.detail(req.params.taskId, function (err, task) {
      if(err) return res.json(err, 400)
      return res.json(task, 201)
    })
  })

  app.post('/api/tasks', function (req, res) {
    var data = req.body
    // Create a users array if it doesn't exist
    if(!data.users)
      data.users = []
    // Add user to user array
    data.users.push({
      user: req.user._id
    , active: false
    })

    TaskService.create(data, function (err, task) {
      if(err) return res.json(err, 400)
      console.log(err, task)
      eventEmitter.emit('taskAdded', task)
      return res.json(task, 201)
    })
  })

  app.get('/api/tasks/:taskId/tasks', function (req, res) {
    TimerService.list(req.params.taskId, function (err, timers) {
      if(err) return res.json(err, 400)
      return res.json(timers, 201)
    })
  })
}