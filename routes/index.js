var express = require('express');
var router = express.Router();

/* GET home page. */
// const content = {
//   title: "Tlaloc",
//   Link1: "Overview",
//   Link2: "Link 2",
//   Link2Sublink1: "Link2Sublink1",
//   Link2Sublink2: "Link2Sublink2",
//   Link2Sublink3: "Link2Sublink3",
//   Link2Sublink4: "Link2Sublink4",
//   Link3: "Link 3",
//   Link4: "Link 4"
// }

const content = {
  sidebarTitle: "Tlaloc",
  sidebarHeading: "Sprinkler Controls",
  link1: "Overview",
  link2: "Sprinklers",
  link2Sublink1: "Sprinkler 1",
  link2Sublink2: "Sprinkler 2",
  link2Sublink3: "Sprinkler 3",
  link2Sublink4: "Sprinkler 4",
  link3: "Existing Rules",
  link4: "Create Rule",
}

router.get('/', function(req, res, next) {
  res.render('layout', content);
});

module.exports = router;
