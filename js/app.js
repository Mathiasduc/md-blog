(function(){
	"use strict";
	var app = {

		localurl: "http://192.168.0.26:8080",
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
				var titleArticle = $("#title").val();
				var contentMd = $("#textarea").val();
				var urlTitle = me.localurl + "/ressources/new/" + titleArticle;

				var postForm = $.ajax({
					method: "POST",
					url: urlTitle,
					data: {article: contentMd, title: titleArticle, path: '/' + titleArticle + ".md" },
					success: function(){
						me.greatSuccess(postForm);
					},
				});
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
			app.selectorArticles.html();
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
			var jqXHR = $.ajax(url)
			.done(function(){
				if(isMarkdown === true){
					var convertedToHtml = converter.makeHtml(jqXHR.responseText);
					app.selectorMD.html(convertedToHtml);
				}else{
					app.selectorMD.html(jqXHR.responseText);
				}
			})
			.fail(app.errorAjax);
		},

		errorAjax: function(){console.log("In fail method, something went wrong");},

		greatSuccess: function(jqXHR){
			console.log(jqXHR,"greatSuccess")
		},

		formClicked: function(){

		},
	};

	$(document).ready(function(){
		app.init();
	});
})();	