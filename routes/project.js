var ProjectService = require('../controllers/project')
  , TaskService = require('../controllers/task')

// ProjectService.create({name: 'Clock'}, function (err, project) {
//   console.log(project)
// })
// ProjectService.detail('52d155ed8d94e2e235000001', function (err, project) {
//   console.log(project)
// })
// ProjectService.update('52d155ed8d94e2e235000001', {name: 'Synth Media'}, function (err, project) {
//   console.log(project)
// })
// ProjectService.delete('52d15d8155a18bcc3d000001', function (err) {
//   console.log(err)
// })

module.exports.createRoutes = function (app, logger) {
  logger.info('project routes')

  // GET Projects
  app.get('/api/projects', function (req, res) {
    // logger.info(req)
    ProjectService.list(req.user.team, function (err, projects) {
      if(err) return res.json(err, 400)
      return res.json(projects, 201)
    })
  })

  // GET Project
  app.get('/api/projects/:projectId', function (req, res) {
    // logger.info(req)
    ProjectService.detail(req.params.projectId, function (err, projects) {
      if(err) return res.json(err, 400)
      return res.json(projects, 201)
    })
  })

  //should this be joined -> should it return object with both project info and it's tasks???
  app.get('/api/projects/:projectId/tasks', function (req, res) {
    TaskService.list(req.params.projectId, function (err, projects) {
      if(err) return res.json(err, 400)
      return res.json(projects, 201)
    })
  })
}