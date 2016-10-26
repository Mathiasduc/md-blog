(function(){
	"use strict";
	var app = {

		selectorMD: $("#md"),
		selectorArticles: $("#articles"),

		init:function(){
			app.requestAjax();
			app.listeners();
		},

		listeners: function(){
			$("#articles").on("click", "a", function(){
				app.displayMd($(this).data("url"));
			});
		},

		requestAjax: function(){
			var jsonRequest = $.ajax("http://192.168.0.50:8080/menu.json")
			.done(function(){
				app.getArticles(jsonRequest.responseJSON.menu);
			})
			.fail(console.log("fail"));
		},

		getArticles: function(menu){
			var len = menu.length;
			for(var i = 0; i < len; i++){
				var url = "http://192.168.0.50:8080" + menu[i].path;
				var title = menu[i].title;
				var anchorArticle = "<a class='item' data-url='" + url + "'>" + title + "</a>";
				app.selectorArticles.append(anchorArticle);
			}
		},

		displayMd: function(url){
			var converter = new showdown.Converter();
			var mdRequest = $.ajax(url)
			.done(function(){
				var convertedToHtml = converter.makeHtml(mdRequest.responseText);
				app.selectorMD.html(convertedToHtml);
			})
			.fail(console.log("fail displayMd")); //demander pk tjrs vrai
		},
	};

	$(document).ready(function(){
		app.init();
	});
})();