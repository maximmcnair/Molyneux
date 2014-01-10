var mongoose = require('mongoose')
  , Schema = mongoose.Schema

// User schema
var ProjectSchema = new Schema({
  title:
  { type: String
  , required: true
  }
, team:
  { type: String
  , required: true
  }
, description:
  { type: String
  , required: true
  }
})

var ProjectModel = mongoose.model('Project', ProjectSchema)

// exports.ProjectModel = mongoose.model('Project', ProjectSchema)
exports.ProjectModel = ProjectModel


ProjectModel.findOne({ title: 'TreePress'}, function (err, doc){
 if(doc === null){
    var newProject = new ProjectModel({
      title: 'TreePress'
    , description: 'A couple laps in BMW\'s latest autonomous driving demo, taking place here at CES this week, are all it took to get me feeling a little woozy. '
    , team: '1'
    })

    newProject.save(function (err, project) {
      if(err) console.log(err)
      console.log(project)
    })
  }
})
