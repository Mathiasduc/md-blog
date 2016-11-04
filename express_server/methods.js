var fs = require('fs');
pathMenuJson = __dirname + "/ressources/menu.json";

module.exports = {
	updateJson: function(valTitle, valPath, articleToEdit, callback){
		fs.readFile(pathMenuJson, 'utf8', function(err, data){
			if(err){console.log(err, "\nfail readJson\n");}	
			var jsonParsed = JSON.parse(data);	

			if (valTitle === undefined){
				console.log("\nDeleting article: ",articleToEdit	);
				jsonParsed.menu.splice(articleToEdit, 1);
				var jsonStringfied = JSON.stringify(jsonParsed);
				console.log("\nwill be written: ",jsonParsed);
				fs.writeFile(pathMenuJson,jsonStringfied,'utf8', (err)=>{
					if(err){
						console.log(err, jsonStringfied, "\nerror in delete index file JSON\n");
					}else{
						callback(jsonParsed);
					}								
				});

			}else{			
				if(articleToEdit){
					console.log("EDIT\n",jsonParsed);
					jsonParsed.menu[articleToEdit].title = valTitle;
				}else{	
					jsonParsed.menu.push({path: valPath, title: valTitle});
					console.log("New:\n",jsonParsed);
				}
				var jsonStringfied = JSON.stringify(jsonParsed);

				fs.writeFile(pathMenuJson,jsonStringfied,'utf8', (err)=>{
					if(err){
						console.log(err);
						console.log(jsonStringfied, "\nin error write file JSON\n");
					}else{
						callback(jsonParsed);
					}										
				});				
			}
		});
	},
}