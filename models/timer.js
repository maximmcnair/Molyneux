var mongoose = require('mongoose')

// Timer schema
var timerSchema = mongoose.Schema({
    user: String
  , title: String
  , project: String
  , tags: Array
  , active: Boolean
  , date: Date
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