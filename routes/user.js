var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers')
const session = require('express-session');
const { getRecommendations } = require('../helpers/ai-helpers')


const nocache = (req, res, next) => {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  next();
};


const verifyLogin = (req, res, next) => {
  if (req.session.user && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user;
  if (!user) {
    return res.redirect('/login');
  }
res.render('user/home-page', { user });

});
router.get('/login', nocache, (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { cssFile: 'user/login.css' })
    req.session.logginErr = false;
  }
})
router.post('/login', (req, res, next) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      req.session.loggedIn = true;
      res.json({ status: true })
    } else {
      req.session.logginErr = 'invalid username or password';
      res.json({ status: false, message: response.message })
    }
  })
})
router.get('/signup', nocache, (req, res, next) => {
  res.render('user/signup', { cssFile: 'user/signup.css' })
})
router.get('/profile', (req, res, next) => {
  res.render('user/profile')
})

router.post('/signup', (req, res, next) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log('sig respo' + response);
    if (response.status) {
      req.session.user = response.newUser.Name;
      console.log(req.session.user);
      req.session.loggedIn = true;
      res.json({ status: true })
    } else {
      res.json({ status: false, message: response.message })
    }

  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect('/');
})
router.get('/career-test', (req, res, next) => {
  res.render('user/career-test', { cssFile: 'user/career-test.css', user: req.session.user })
})

router.post('/career-test/submit', async (req, res, next) => {
  try {
    const userData = req.body;
    const careerResult = await getRecommendations(userData);
    res.render('user/recommendation', { cssFile: 'user/recommendation.css', careerResult, user: req.session.user})
  } catch (err) {
    console.log('Gemini Api Error', err);
    res.status(500).send("Something went wrong with Gemini API");
  }
})
module.exports = router;
