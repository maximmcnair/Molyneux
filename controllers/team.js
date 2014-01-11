var mongoose = require('mongoose')
  , TeamModel = require('../models/team.js').TeamModel
  , ProjectModel = require('../models/project.js').ProjectModel
  , UserModel = require('../models/user.js').UserModel

console.log('team')

module.exports.create = function (data, callback) {
  var newTeam = new TeamModel(data)
  newTeam.save(function (err) {
    if(err) callback(err)
    callback(null, newTeam)
  })
}

// module.exports.list = function () {
//   ProjectModel.find({team: req.user._id}, function (err, projects) {
//     if(err) 
//   })
// }

module.exports.detail = function (teamId, callback) {
  TeamModel.findById(teamId, function (err, team) {
    if(err) callback(err)
    callback(null, team)
  })
}

module.exports.update = function (teamId, data, callback) {
  TeamModel.findById(teamId, function (err, team) {
    if(err) callback(err)
    var key
    for (key in data) {
      team[key] = data[key]
    }
    team.save(function (err) {
      if(err) callback(err)
      callback(null, team)
    })
  })
}

module.exports.delete = function (teamId, callback) {
  TeamModel.findById(teamId, function (err, team) {
    if(err) callback(err)
    team.remove(function (err) {
      if(err) callback(err)
      callback(null)
    })
  })
}

module.exports.getMembers = function (teamId, callback) {
  UserModel.find({team: teamId}, function (err, users) {
    if(err) callback(err)
    // console.log('users found', users)
    callback(null, users)  
  })
}