var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET something else. */
router.get('/thing', function(req, res, next) {
  let key = process.env.ADMIN_API_KEY
  res.send(key);
});

module.exports = router;
