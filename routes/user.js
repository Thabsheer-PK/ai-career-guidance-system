var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('user/home-page', { title: 'Thabsheer' });
});
router.get('/login', (req, res, next) => {
  res.render('user/login', { cssFile: 'user/login.css', showHeader: false })
})
router.get('/signup', (req, res, next) => {
  res.render('user/signup', { cssFile: 'user/signup.css', showHeader: false })
})
module.exports = router;
