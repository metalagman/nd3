"use strict";

const client = require('mongodb').MongoClient;
const config = require("./config.json");
const app = require('express')();
const rest = require('./api_rest');

app.use(require('body-parser').json());

app.use('/rest', rest(config));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, function () {
    console.log('listening on 3000')
});