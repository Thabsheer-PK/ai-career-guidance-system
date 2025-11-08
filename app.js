var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const { connectDB } = require('./config/connection');
const MongoStore = require('connect-mongo');
const session = require('express-session');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Use session (use connection string directly from env instead of mongoose.client for Vercel)
app.use(
  session({
    secret: 'Key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // 👈 works both locally & on Vercel
      collectionName: 'sessions',
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// ✅ View engine setup
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views/layout/'),
    partialsDir: path.join(__dirname, 'views/partials/'),
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
app.use('/', userRouter);
app.use('/admin', adminRouter);

// ✅ Catch 404 and errors
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ✅ Allow both local and Vercel usage
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on port ${PORT}`);
  });
} else {
  module.exports = app;
}
