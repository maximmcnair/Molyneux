var mongoose = require('mongoose')

// Timer schema
var timerSchema = mongoose.Schema({
    user: String
  , task: String
  , project: String
  , start: String
  , stop: String
  , total: String
})

exports.TimerModel = mongoose.model('Timer', timerSchema)