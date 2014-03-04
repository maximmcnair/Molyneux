var mongoose = require('mongoose')
  , TimerModel = require('../models/timer.js').TimerModel

module.exports.create = function (data, callback) {
  var newTimer = new TimerModel(data)
  newTimer.save(function (err) {
    if(err) return callback(err)
    console.log(null, newTimer)
    callback(null, newTimer)
  })
}

module.exports.list = function (query, options, callback) {
  TimerModel.find(query).skip(options.skip).limit(options.limit).execFind(function(err, timers) {
    if(err) return callback(err)
    callback(null, timers)
  })
}

module.exports.count = function (query, callback) {
  TimerModel.count(query, function(err, count) {
    if(err) return callback(err)
    callback(null, count)
  })
}

module.exports.detail = function (timerId, callback) {
  TimerModel.findById(timerId, function (err, timer) {
    if(err) return callback(err)
    callback(null, timer)
  })
}

module.exports.update = function (timerId, data, callback) {
  TimerModel.findById(timerId, function (err, timer) {
    if(err) return callback(err)
    var key
    for (key in data) {
      timer[key] = data[key]
    }
    timer.save(function (err) {
      if(err) return callback(err)
      callback(null, timer)
    })
  })
}

module.exports.delete = function (timerId, callback) {
  TimerModel.findById(timerId, function (err, timer) {
    if(err) return callback(err)
    if(timer){
      timer.remove(function (err) {
        if(err) return callback(err)
        callback(null)
      })
    }
  })
}

module.exports.tags = function (callback) {
  TimerModel.find().distinct('tags', function(err, results){
    if ( err ){
      console.log('Tags error', err)
      return callback(err)
    }
    console.log(results)
    return callback(null, results)
  })
}