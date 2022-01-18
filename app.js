const express = require('express');
const app = express();
const mongoose = require('mongoose')

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const cors = require('cors');


// Models Imports
const Post = require('./models/post');
const Appointment = require('./models/appointments');

// DB connection
mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
  console.log('Connected to database')
})
.catch(() => {
  console.log('Connection failed')
})

// View engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
  const collection = req.app.locals[config.dbCollection];
  req.collection = collection;
  next()
})

// Posts 
app.post('/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added',
      postId: createdPost._id
    });
  });
})

app.get('/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched success',
        posts: documents
    });
  });
})

app.delete('/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({ message: "Post deleted"});
  })
});

// Appointments
app.post('/appointments', (req, res, next) => {
  const appointment = new Appointment({
    name: req.body.name,
    date: req.body.date,
    email: req.body.email
  });
  appointment.save().then(createdAppointment => {
    res.status(201).json({
      message: 'Appointment added',
      appointmentId: createdAppointment._id
    });
  });
})

app.get('/appointments', (req, res, next) => {
  Appointment.find()
    .then(documents => {
      res.status(200).json({
        message: 'Appointments fetched success',
        appointments: documents
    });
  });
})

app.delete('/appointments/:id', (req, res, next) => {
  Appointment.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({ message: "Appointment deleted"});
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
