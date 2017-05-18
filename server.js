var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();

var routes = require('./routes');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    res.send('Server is running!');
});


app.use('/api', routes);


// Hndle Error
app.use(function(err, req, res, next) {
  res.status(500).send({error: err});
});

var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);

app.listen(port, function() {
  console.log('server running, port:'+ port);
});