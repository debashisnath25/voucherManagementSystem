const express = require ('express');
require ('express-async-errors');
const cors = require ('cors');
const app = express ();
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');

//database connection
require ('./config/db');

//Models
require ('./models/Voucher');
require ('./models/VoucherLog');

//Middleware
app.use (bodyParser.json ());
app.use (cors ());


//Routes
app.use ('/api/voucher', require ('./controllers/Voucher'));

//Not Found Route
app.use ((req, res, next) => {
  req.status = 404;
  const error = new Error ('404! Routes not found');
  next (error);
});

//error handler
if (app.get ('env') === 'production') {
  app.use ((error, req, res, next) => {
    res.status (req.status || 500).send ({
      message: error.message,
    });
  });
}

app.use ((error, req, res, next) => {
  res.status (req.status || 500).send ({
    message: error.message,
    stack: error.stack,
  });
});

var port = process.env.PORT || 4000;

app.listen (port , function () {
  console.log ('Server is runninggg on port: '+ port);
});
