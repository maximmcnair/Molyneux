// export function for listening to the socket
module.exports = function (socket, eventEmitter) {
  var user = socket.manager.handshaken[socket.store.id].user
    , teamId = user.team

  // socket.join(teamId)

  require('./sockets/users')(socket, user, teamId)
  require('./sockets/projects')(socket, user, teamId)
  require('./sockets/tasks')(socket, eventEmitter, user, teamId)
}