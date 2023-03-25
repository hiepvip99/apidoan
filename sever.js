const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv');
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// CORS

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// const routes = require('./api/routes') //importing route
const routes = require('./api/route/accountRouter'); //importing route
// routes(app)
app.use('/api', routes);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'});
});



app.listen(port);

console.log('RESTful API server started on: ' + port);
