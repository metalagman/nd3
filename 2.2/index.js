const app = require('express')();
const bp = require('body-parser');

const rest = require('./api_rest');

app.use(bp.json());

app.use('/rest', rest);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, function () {
    console.log('listening on 3000')
});