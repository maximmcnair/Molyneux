var mongoose = require('mongoose')
  , TaskModel = require('../models/task.js').TaskModel

module.exports.create = function (data, callback) {
  var newTask = new TaskModel(data)
  newTask.save(function (err) {
    if(err) callback(err)
    callback(null, newTask)
  })
}

module.exports.list = function (projectId, callback) {
  TaskModel.find({project: projectId}, function (err, tasks) {
    if(err) callback(err)
    callback(null, tasks)
  })
}

module.exports.detail = function (taskId, callback) {
  TaskModel.findById(taskId, function (err, task) {
    if(err) callback(err)
    callback(null, task)
  })
}

module.exports.update = function (taskId, data, callback) {
  TaskModel.findById(taskId, function (err, task) {
    if(err) callback(err)
    var key
    for (key in data) {
      task[key] = data[key]
    }
    task.save(function (err) {
      if(err) callback(err)
      callback(null, task)
    })
  })
}

module.exports.delete = function (taskId, callback) {
  TaskModel.findById(taskId, function (err, task) {
    if(err) callback(err)
    task.remove(function (err) {
      if(err) callback(err)
      callback(null)
    })
  })
}