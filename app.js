"use strict"


const excelRoutes = require('./routes/excelRoutes.js');
const express = require("express");
const options = require('./config/options.json');
const bodyParser = require('body-parser');
const app = express(bodyParser.json);
const path = require('path');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("/www"));


app.use('/images', express.static(__dirname + '/www/images'));
app.use('/scripts', express.static(__dirname + '/www/scripts'));
app.use('/styles', express.static(__dirname + '/www/styles'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/www/index.html'));
});

app.get('/tempos', excelRoutes.getTempos);
app.get('/horas/semana', excelRoutes.getWeekHours);
app.get('/horas/fds', excelRoutes.getWeekendHours);
app.post('/info', excelRoutes.getResults);

app.use(function(req, res, next) {
    if (req.path.includes(".html") || req.path.includes(".css") || req.path.includes(".js")) {
        return res.status(404).sendFile(path.join(__dirname + '/www/index.html'));
    }
    next();
});


app.listen(process.env.port || options.server.port, function () {
    console.log("Server running at port:" + options.server.port);
});