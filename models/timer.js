var mongoose = require('mongoose')

// Timer schema
var timerSchema = mongoose.Schema({
    user: String
  , task: String
  , project: String
  , start: 
    { type: String
    , default: '0'
    }
  , stop: 
    { type: String
    , default: '0'
    }
  , total: 
    { type: Number
    , default: 0
    }
})

exports.TimerModel = mongoose.model('Timer', timerSchema)