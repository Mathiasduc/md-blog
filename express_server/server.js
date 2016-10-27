var express = require('express');

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

app.use("/",function (req, res, next) {
  console.log(req, "result");
  next();
});

app.listen(8080);