var express = require('express');

var app = express();
app.use(express.static('ressources'));
		

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(8080);