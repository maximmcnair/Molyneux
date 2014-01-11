// var teamUsers = {
//   '1': []
// , '2': []
// }

var ProjectModel = require('../models/project.js').ProjectModel


// export function for listening to the socket
module.exports = function (socket) {
  var user = socket.manager.handshaken[socket.store.id].user
    , team = user.team

  // console.log('user: ', user)
  // console.log('team: ', team)

  socket.join(team)

  // Register user in team
  // if(!teamUsers[team][user.username]){
  //   teamUsers[team].push(user.username)
  // }

  // send the new user their name and a list of users
  ProjectModel.find({ team: team}, function (err, doc){
    socket.emit('init', {
    //   name: user.username
    // , team: team
    // , users: teamUsers[team]
    // ,
    projects: doc
    })
  })

  // notify other clients that a new user has joined
  // socket.broadcast.in(team).emit('user:join', {
  //   name: user.username
  // })

  // broadcast a user's project to other users
  socket.on('project:add', function (data) {
    var project = {
      title: data.title
    , description: data.description
    , thumbnail: data.thumbnail
    }
    // Send project to other users
    socket.broadcast.in(team).emit('project:add', project)

    // Save project to db
    var newProject = new ProjectModel({
      title: project.title
    , description: project.description
    , team: team
    , thumbnail: project.thumbnail
    })
    newProject.save(function (err, project) {
      if(err) console.log(err)
      console.log(project)
    })
  })

  // Remove projects
  socket.on('project:remove', function (projectTitle) {
    ProjectModel.findOne({title: projectTitle}, function (err, project) {
      project.remove( function (err) {
        if(err) {
          console.log(err)
        } else {
          socket.broadcast.in(team).emit('project:remove', projectTitle)
        }
      })
    })
  })

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.in(team).emit('user:left', {
      name: user.username
    })
    // var index = teamUsers[team].indexOf(user.username)
    // if (index > -1) {
    //   teamUsers[team].splice(index, 1);
    // }
  })
}