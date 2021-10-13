const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport')
const http = require('http');
const router = require('./router');
const mongoose = require('mongoose')
const app = express()
//db setup
mongoose.connect('mongodb://127.0.0.1:27017/auth')
//appsetup
app.use(morgan('combined'));
app.use(bodyParser.json({type:'*/*'}));
app.use( passport.initialize() );
router(app)
//serversetup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('app is listening on:' ,port)