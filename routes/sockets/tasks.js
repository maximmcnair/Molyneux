var TaskService = require('../../controllers/task')

module.exports = function (socket, user, teamId) {
  // send the new user their name and a list of users
  socket.on('tasks:get', function (data) {
    TaskService.list(data.project, function (err, tasks) {
      socket.emit('tasks:get', {
        tasks: tasks
      })
    })
  })

  // Add task
  socket.on('tasks:add', function (data) {
    // Save task to db
    var newTask = {
      title: data.title
    , description: data.description
    , project: data.project
    , estimate: data.estimate
    , time: data.time
    }
    TaskService.create(newTask, function (err, task) {
      if(err) {
        console.log(err)
      } else {
        console.log(task)
        // Send task to other users
        socket.broadcast.in(teamId).emit('tasks:add', newTask)
      }
    })
  })

  // Remove tasks
  // socket.on('tasks:remove', function (taskTitle) {
  //   taskModel.findOne({title: taskTitle}, function (err, task) {
  //     task.remove( function (err) {
  //       if(err) {
  //         console.log(err)
  //       } else {
  //         socket.broadcast.in(teamId).emit('tasks:remove', taskTitle)
  //       }
  //     })
  //     TaskService.delete('52d15d8155a18bcc3d000001', function (err) {
  //       console.log(err)
  //     })
  //   })
  // })

}