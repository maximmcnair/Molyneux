var mongoose = require('mongoose')
  , TaskModel = require('../models/task.js').TaskModel
  , _ = require('lodash')

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

module.exports.updateActive = function (taskId, userId, active, callback) {
  TaskModel.findById(taskId, function (err, task) {
    if(err) callback(err)

    var user = _.find(task.users, function(user){
      return user.user == userId
    })
    if(user) {
      // If task has user update active
      user.active = active
    } else {
      // If task doesn't have user create user and active state
      task.users.push({
        user: userId
      , active: active
      })
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