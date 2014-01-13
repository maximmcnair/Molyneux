var mongoose = require('mongoose')
  , TimerModel = require('../models/timer.js').TimerModel

module.exports.create = function (data, callback) {
  var newTimer = new TimerModel(data)
  newTimer.save(function (err) {
    if(err) callback(err)
    console.log(null, newTimer)
    callback(null, newTimer)
  })
}

module.exports.list = function (taskId, callback) {
  TimerModel.find({task: taskId}, function (err, timers) {
    if(err) callback(err)
    callback(null, timers)
  })
}

module.exports.detail = function (timerId, callback) {
  TimerModel.findById(timerId, function (err, timer) {
    if(err) callback(err)
    callback(null, timer)
  })
}

module.exports.update = function (timerId, data, callback) {
  TimerModel.findById(timerId, function (err, timer) {
    if(err) callback(err)
    var key
    for (key in data) {
      timer[key] = data[key]
    }
    timer.save(function (err) {
      if(err) callback(err)
      callback(null, timer)
    })
  })
}

module.exports.delete = function (timerId, callback) {
  TimerModel.findById(timerId, function (err, timer) {
    if(err) callback(err)
    timer.remove(function (err) {
      if(err) callback(err)
      callback(null)
    })
  })
}