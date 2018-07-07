var express = require('express');
var router = express.Router();

/* GET home page. */
const content = {
  title: "Tlaloc",
  Link1: "Overview",
  Link2: "Link 2",
  Link2Sublink1: "Link2Sublink1",
  Link2Sublink2: "Link2Sublink2",
  Link2Sublink3: "Link2Sublink3",
  Link2Sublink4: "Link2Sublink4",
  Link3: "Link 3",
  Link4: "Link 4"
}

router.get('/', function(req, res, next) {
  res.render('layout', content);
});

module.exports = router;
