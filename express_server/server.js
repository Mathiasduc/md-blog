var express = require('express');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var textParser = bodyParser.text();

var app = express();

app.use(express.static('ressources'));

		
/*
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});*/

app.post('/',function (req, res) {
	/*if (!req.body) {return res.sendStatus(400);}*/
	console.log(req,req.body);
	res.send("test");

});
/*
app.use('/menu.json',function (req, res, next) {
  console.log(req);
  next();
});*/

app.use('/UUUUUUUU',function (req, res, next) {
  console.log( textParser(req),"middle");
  next();
});

app.use('/',function (req, res, next) {
  console.log(req);
  next();
});



app.listen(8080);