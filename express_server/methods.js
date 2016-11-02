var fs = require('fs');
pathMenuJson = __dirname + "/ressources/menu.json";

module.exports = {
	updateJson: function(valTitle, valPath, articleToEdit){
		if (!arguments[0] || !arguments[1]){
			console.log("updateJson need two arguments at least")
		}else{
			fs.readFile(pathMenuJson, 'utf8', function(err, data){
				if(err){console.log(err, "\nfail updateJson\n");}
				var jsonTemp = JSON.parse(data);
				if(articleToEdit){
					console.log("EDIT\n",jsonTemp);
					jsonTemp.menu[articleToEdit].title = valTitle;
				}else{
				jsonTemp.menu.push({path: valPath, title: valTitle});
				}
				var jsonStringfied = JSON.stringify(jsonTemp);

				fs.writeFile(pathMenuJson,jsonStringfied,'utf8', (err)=>{
					if(err){
						console.log(err);
						console.log(jsonStringfied, "\nin error write file JSON\n");
					}								
				});
			});
		}
	},
}