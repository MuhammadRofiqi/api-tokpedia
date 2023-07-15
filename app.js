require("dotenv").config();
const express     = require('express');
const path        = require('path');
const logger      = require('morgan');
const compression = require('compression');
const cors        = require('cors');
const boom        = require('express-boom'); 

const app = express();

app.use(logger('dev'));
app.use(boom());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  credentials: true
}));
app.use(compression({ level: 1 }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// define routes
app.use(require("./app/routes"));

module.exports = app;
