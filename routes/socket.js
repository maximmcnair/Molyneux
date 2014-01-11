var usersOnline = {}

var ProjectModel = require('../models/project.js').ProjectModel
  , TeamService = require('../controllers/team')
  , async = require('async')


// export function for listening to the socket
module.exports = function (socket) {
  var user = socket.manager.handshaken[socket.store.id].user
    , teamId = user.team

  socket.join(teamId)

  // Register user in team
  if(usersOnline[teamId]) {
    if(!usersOnline[teamId][user.username]) usersOnline[teamId].push(user.username)
  } else {
    usersOnline[teamId] = []
    if(!usersOnline[teamId][user.username]) usersOnline[teamId].push(user.username)
  }

  // send the new user their name and a list of users
  async.parallel([
    function(callback){
      ProjectModel.find({ team: teamId}, function (err, projects){
        callback(err, projects)
      })
    },
    function(callback){
      TeamService.detail(teamId, function (err, team) {
        // console.log('**team', team)
        callback(err, team)
      })
    },
    function(callback){
      TeamService.getMembers(teamId, function (err, users) {
        var usersByName = {}
          , cb = callback

        async.each(users, function(user, callback){
          // console.log(user)
          usersByName[user.username] = user
          callback()
        }, function(err){
          // console.log('callbacked', cb)
          cb(err, usersByName)
        })

      })
    }
  ],
  // optional callback
  function(err, results){
    socket.emit('init', {
      projects: results[0]
    , users: usersOnline[teamId]
    , name: user.username
    , team: {
        name: results[1].name
      , members: results[2]
      }
    , 
    })
  });

  // notify other clients that a new user has joined
  socket.broadcast.in(teamId).emit('user:join', {
    name: user.username
  })

  // broadcast a user's project to other users
  socket.on('project:add', function (data) {
    var project = {
      title: data.title
    , description: data.description
    , thumbnail: data.thumbnail
    }
    // Send project to other users
    socket.broadcast.in(teamId).emit('project:add', project)

    // Save project to db
    var newProject = new ProjectModel({
      title: project.title
    , description: project.description
    , team: teamId
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
          socket.broadcast.in(teamId).emit('project:remove', projectTitle)
        }
      })
    })
  })

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.in(teamId).emit('user:left', {
      name: user.username
    })
    var index = usersOnline[teamId].indexOf(user.username)
    if (index > -1) {
      usersOnline[teamId].splice(index, 1);
    }
  })
}