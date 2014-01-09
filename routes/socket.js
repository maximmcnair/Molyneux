// Keep track of which names are used so that there are no duplicates
// var userNames = (function () {
//   var names = {}

//   var claim = function (name) {
//     if (!name || names[name]) {
//       return false
//     } else {
//       names[name] = true
//       return true
//     }
//   }

//   // find the lowest unused "guest" name and claim it
//   var getGuestName = function () {
//     var name,
//       nextUserId = 1

//     do {
//       name = 'Guest ' + nextUserId
//       nextUserId += 1
//     } while (!claim(name))

//     return name
//   }

//   // serialize claimed names as an array
//   var get = function () {
//     var res = []
//     for (user in names) {
//       res.push(user)
//     }

//     return res
//   }

//   var free = function (name) {
//     if (names[name]) {
//       delete names[name]
//     }
//   }

//   return {
//     claim: claim,
//     free: free,
//     get: get,
//     getGuestName: getGuestName
//   }
// }())

var teams = {
  '1': []
, '2': []
}

// export function for listening to the socket
module.exports = function (socket) {
  var user = socket.manager.handshaken[socket.store.id].user
    , team = user.team

  // console.log('user: ', user)
  // console.log('team: ', team)

  socket.join(team)

  // Register user in team
  if(!teams[team][user.username]){
    teams[team].push(user.username)
  }

  // send the new user their name and a list of users
  socket.emit('init', {
    name: user.username
  , team: team
  , users: teams[team]
  })

  // notify other clients that a new user has joined
  socket.broadcast.in(team).emit('user:join', {
    name: user.username
  })

  // broadcast a user's project to other users
  socket.on('send:project', function (data) {
    socket.broadcast.in(team).emit('send:project', {
      title: data.title,
      description: data.description
    })
  })

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.in(team).emit('user:left', {
      name: user.username
    })
    var index = teams[team].indexOf(user.username)
    if (index > -1) {
      teams[team].splice(index, 1);
    }
  })
}