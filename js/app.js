(function(){
	"use strict";
	var app = {

		localurl: "http://192.168.43.133:8080",
		selectorMD: $("#md"),
		selectorArticles: $("#articles"),

		init:function(){
			app.requestJson();
			app.listeners();
		},

		listeners: function(){
			var me = this;
			$("#articles").on("click", "a", function(){
				if($(this).data("type") === "edit"){
					app.display($(this).data("url"), false);		
				}else{
					app.display($(this).data("url"), true);
				}
			});
			$("#md").on("click", "#form-sub", function(event){
				event.preventDefault();
				console.log("click sub");
				var title = $("#title").val();
				$.ajax({
					method: "POST",
					url: me.localurl + "/" + title,
					data: { TRRRUUUUUC : "bidule"},
					success: function(){me.greatSuccess},
					/*dataType: "text",*/
				});

				console.log(title);
			});
		},

		requestJson: function(){
			var me = this;	
			var jsonRequest = $.ajax(this.localurl + "/menu.json")
			.done(function(){
				me.getArticles(jsonRequest.responseJSON.menu);
			})
			.fail(app.errorAjax);
		},

		getArticles: function(menu){
			var len = menu.length;
			for(var i = 0; i < len; i++){
				var url = this.localurl + menu[i].path;
				var title = menu[i].title;
				var anchorArticle = "<a class='item' data-url='" + url + "'>" + title + "</a>";
				app.selectorArticles.append(anchorArticle);
			}
		},

		display: function(url, isMarkdown){
			var converter = new showdown.Converter();
			var mdRequest = $.ajax(url)
			.done(function(){
				if(isMarkdown === true){
					var convertedToHtml = converter.makeHtml(mdRequest.responseText);
					app.selectorMD.html(convertedToHtml);
				}else{
					app.selectorMD.html(mdRequest.responseText);
				}
			})
			.fail(app.errorAjax);
		},

		errorAjax: function(){console.log("In fail method, something went wrong");},

		greatSuccess: function(){
			console.log("greatSuccess")
		},
		formClicked: function(){

		},
	};

	$(document).ready(function(){
		app.init();
	});
})();