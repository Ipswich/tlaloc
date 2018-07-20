var express = require('express');
var router = express.Router();

/* GET create rule listing. */
router.get('/', function(req, res, next) {
  res.render('createrule');
});

module.exports = router;
