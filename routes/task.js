var TaskService = require('../controllers/task')

module.exports.createRoutes = function (app, logger) {
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
}