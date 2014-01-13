var usersOnline = {}
  , async = require('async')
  , TeamService = require('../../controllers/team')

module.exports = function (socket, user, teamId) {
  // Register user in team
  if(usersOnline[teamId]) {
    if(!usersOnline[teamId][user.username]) usersOnline[teamId].push(user.username)
  } else {
    usersOnline[teamId] = []
    if(!usersOnline[teamId][user.username]) usersOnline[teamId].push(user.username)
  }

  // send the new user their name and a list of users

  socket.on('users:join', function (data) {
    socket.join('team' + teamId)
    async.parallel([
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
      socket.emit('users:join', {
        users: usersOnline[teamId]
      , name: user.username
      , team: {
          name: results[0].name
        , members: results[1]
        }
      })
    })
  })

  // notify other clients that a new user has joined
  socket.broadcast.in('team' + teamId).emit('users:new', {
    name: user.username
  })

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.in('team' + teamId).emit('users:left', {
      name: user.username
    })
    var index = usersOnline[teamId].indexOf(user.username)
    if (index > -1) {
      usersOnline[teamId].splice(index, 1);
    }
  })
}