var mongoose = require('mongoose')
  , ProjectModel = require('../models/project.js').ProjectModel

module.exports.create = function (data, callback) {
  var newproject = new ProjectModel(data)
  newproject.save(function (err) {
    if(err) callback(err)
    callback(null, newproject)
  })
}

module.exports.list = function (projectId, callback) {
  ProjectModel.find({team: projectId}, function (err, projects) {
    if(err) callback(err)
    callback(null, projects)
  })
}

module.exports.detail = function (projectId, callback) {
  ProjectModel.findById(projectId, function (err, project) {
    if(err) callback(err)
    callback(null, project)
  })
}

module.exports.update = function (projectId, data, callback) {
  ProjectModel.findById(projectId, function (err, project) {
    if(err) callback(err)
    var key
    for (key in data) {
      project[key] = data[key]
    }
    project.save(function (err) {
      if(err) callback(err)
      callback(null, project)
    })
  })
}

module.exports.delete = function (projectId, callback) {
  ProjectModel.findById(projectId, function (err, project) {
    if(err) callback(err)
    project.remove(function (err) {
      if(err) callback(err)
      callback(null)
    })
  })
}