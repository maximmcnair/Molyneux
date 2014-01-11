var ProjectModel = require('../../models/project.js').ProjectModel
  , ProjectService = require('../../controllers/project')

module.exports = function (socket, user, teamId) {
  // send the new user their name and a list of users
  socket.on('projects:get', function (data) {
    ProjectService.list(teamId, function (err, projects) {
      socket.emit('projects:get', {
        projects: projects
      })
    })
  })

  // broadcast a user's project to other users
  socket.on('projects:add', function (data) {
    var project = {
      title: data.title
    , description: data.description
    , thumbnail: data.thumbnail
    }
    // Send project to other users
    socket.broadcast.in(teamId).emit('projects:add', project)

    // Save project to db
    var newProject = {
      title: project.title
    , description: project.description
    , team: teamId
    , thumbnail: project.thumbnail
    }
    ProjectService.create(newProject, function (err, project) {
      if(err) console.log(err)
      console.log(project)
    })
  })

  // Remove projects
  socket.on('projects:remove', function (projectTitle) {
    // ProjectService.delete('52d15d8155a18bcc3d000001', function (err) {
    //   console.log(err)
    // })
    ProjectModel.findOne({title: projectTitle}, function (err, project) {
      project.remove( function (err) {
        if(err) {
          console.log(err)
        } else {
          socket.broadcast.in(teamId).emit('projects:remove', projectTitle)
        }
      })
    })
  })

}