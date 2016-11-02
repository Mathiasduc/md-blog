var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var meth = require('./methods.js');

var jsonParser = bodyParser.json();
var textParser = bodyParser.text();
var ressourcesPath = __dirname + '/ressources';

var app = express();

app.use(express.static(__dirname + '/ressources'));
app.use(express.static(__dirname + '/../'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('\nSomething broke!');
});

app.get('/', function(req, res){
	console.log("test");
    res.sendFile('index.html');
});

app.post('/ressources',jsonParser, function (req, res) {
	if (!req.body) {return res.sendStatus(400);}
	console.log(req.body);
	fs.writeFile(ressourcesPath + req.body.path, req.body.article, 'utf8','wx',(err) => {
		if(err){
			console.log(err);
		}else{
			meth.updateJson(req.body.title, req.body.path, req.body.articleToEdit);
			res.sendStatus(200);
		}
	});
});

app.listen(8080);