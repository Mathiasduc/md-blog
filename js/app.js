(function(){
	"use strict";
	var app = {

		selectorMD: $("#md"),
		selectorArticles: $("#articles"),

		init:function(){
			app.requestJson();
			app.listeners();
		},

		listeners: function(){
			$("#articles").on("click", "a", function(){
				app.displayMd($(this).data("url"));
			});
		},

		requestJson: function(){
			var me = this;	
			var jsonRequest = $.ajax("http://192.168.1.107:8080/menu.json")
			.done(function(){
				me.getArticles(jsonRequest.responseJSON.menu);
			})
			.fail(app.errorAjax);
		},

		getArticles: function(menu){
			var len = menu.length;
			for(var i = 0; i < len; i++){
				var url = "http://192.168.1.107:8080" + menu[i].path;
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
			.fail(app.errorAjax);
		},

		errorAjax: function(){console.log("In fail method, something went wrong");},
	};

	$(document).ready(function(){
		app.init();
	});
})();