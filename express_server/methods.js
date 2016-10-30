var fs = require('fs');
pathMenuJson = __dirname + "/ressources/menu.json";

module.exports = {
	updateJson: function(keyTitle, keyPath){
		/*if (!arguments[0] || arguments[1]){
			console.log("updateJson need two arguments")
		}else{*/
			fs.readFile(pathMenuJson, 'utf8', function(err, data){
				if(err){console.log(err);}
				var jsonTemp = JSON.parse(data);
				jsonTemp.menu.push({path: keyPath,title: keyTitle});
				var jsonStringfied = JSON.stringify(jsonTemp);

				fs.writeFile(pathMenuJson,jsonStringfied,'utf8', (err)=>{
					if(err){console.log(err);}
					console.log(jsonStringfied);			
				});
			});
		/*}*/
	},
}