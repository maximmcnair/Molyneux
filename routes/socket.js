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

var teamUsers = {
  '1': []
, '2': []
}

var teamProjects = {
  '1':  [ { title: 'TreePress'
          , description: 'A couple laps in BMW\'s latest autonomous driving demo, taking place here at CES this week, are all it took to get me feeling a little woozy. '
          }
        , { title: 'Fosters Events'
          , description: 'As thrilling and entertaining as the ride was, there\'s actually method to BMW\'s madness. The company notes that self-driving systems won\'t really be ready for prime time until they\'re able to handle all road situations.'
          }
        ]
, '2':  [ { title: 'Creo Medical'
          , description: 'The demonstration was an exclamation point that researchers in the auto industry are starting to get a handle on making self-driving cars practical (and safe) in even non-optimal driving conditions, but there\s still lots of work to do.'
          }
        ]
}


// export function for listening to the socket
module.exports = function (socket) {
  var user = socket.manager.handshaken[socket.store.id].user
    , team = user.team

  // console.log('user: ', user)
  // console.log('team: ', team)

  socket.join(team)

  // Register user in team
  if(!teamUsers[team][user.username]){
    teamUsers[team].push(user.username)
  }

  // send the new user their name and a list of users
  socket.emit('init', {
    name: user.username
  , team: team
  , users: teamUsers[team]
  , projects: teamProjects[team]
  })

  // notify other clients that a new user has joined
  socket.broadcast.in(team).emit('user:join', {
    name: user.username
  })

  // broadcast a user's project to other users
  socket.on('send:project', function (data) {
    var project = {
      title: data.title,
      description: data.description
    }
    socket.broadcast.in(team).emit('send:project', project)
    teamProjects[team].push(project)
  })

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.in(team).emit('user:left', {
      name: user.username
    })
    var index = teamUsers[team].indexOf(user.username)
    if (index > -1) {
      teamUsers[team].splice(index, 1);
    }
  })
}