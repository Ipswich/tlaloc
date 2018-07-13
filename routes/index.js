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
  link1: "Sprinkler Set 1",
  link1Sublink1: "Sprinkler 1",
  link1Sublink2: "Sprinkler 2",
  link1Sublink3: "Sprinkler 3",
  link2: "Existing Rules",
  link3: "Sprinkler Set 2",
  link3Sublink1: "Sprinkler 4",
  link3Sublink2: "Sprinkler 5",
  link3Sublink3: "Sprinkler 5",
  link4: "Create Rule",
  link5: "About"
}

router.get('/', function(req, res, next) {
  res.render('layout', content);
});

module.exports = router;
