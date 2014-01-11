var TeamService = require('../controllers/team')

// TeamService.create({name: 'Clock'}, function (err, team) {
//   console.log(team)
// })
// TeamService.detail('52d155ed8d94e2e235000001', function (err, team) {
//   console.log(team)
// })
// TeamService.update('52d155ed8d94e2e235000001', {name: 'Synth Media'}, function (err, team) {
//   console.log(team)
// })
// TeamService.delete('52d15d8155a18bcc3d000001', function (err) {
//   console.log(err)
// })
// TeamService.getMembers('52d155ed8d94e2e235000001', function (err, users) {
//   console.log(users)
// })

exports.getMembers = function (req, res) {
  TeamService.getMembers(req.params.teamId, function (err, users) {
    if(err) return res.json(err, 400)
    return res.json(users, 201)
  })
}