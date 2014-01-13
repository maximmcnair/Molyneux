var TaskService = require('../../controllers/task')

module.exports = function (socket, eventEmitter, user, teamId) {
  // send the new user their name and a list of users
  socket.on('tasks:join', function (data) {
    socket.join('task' + data.project)
    TaskService.list(data.project, function (err, tasks) {
      socket.emit('tasks:join', {
        tasks: tasks
      })
    })
  })

  // Add task
  // socket.on('tasks:add', function (data) {
  //   // Save task to db
  //   var newTask = {
  //     title: data.title
  //   , description: data.description
  //   , project: data.project
  //   , estimate: data.estimate
  //   , time: data.time
  //   }
  //   TaskService.create(newTask, function (err, task) {
  //     if(err) {
  //       console.log(err)
  //     } else {
  //       console.log(task)
  //       // Send task to other users
  //       socket.broadcast.in(teamId).emit('tasks:add', newTask)
  //     }
  //   })
  // })
  eventEmitter.on('taskAdded', function (task) {
    socket.broadcast.in('task' + task.project).emit('tasks:add', task)
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