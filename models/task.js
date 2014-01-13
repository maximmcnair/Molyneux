var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var TaskSchema = new Schema({
  title:
  { type: String
  , required: true
  }
, description:
  { type: String
  , required: true
  }
, project:
  { type: String
  , required: true
  }
// , deadline:
//   { type: String
//   , required: true
//   }
, estimate:
  { type: Number
  , default: 0
  }
, time:
  { type: Number
  , default: 0
  }
// , team:
//   { type: Array
//   , required: true
//   }
})

var TaskModel = mongoose.model('Task', TaskSchema)

exports.TaskModel = TaskModel