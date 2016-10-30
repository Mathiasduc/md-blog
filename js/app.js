(function(){
	"use strict";
	var app = {

		localurl: "http://192.168.0.26:8080",
		selectorMD: $("#md"),
		selectorArticles: $("#articles"),

		init:function(){
			this.requestJson(this.getArticles);
			this.listeners();
			this.semanticSettings();
		},

		listeners: function(){
			var me = this;
			$("#global-menu").on("click", "a", function(){
				if($(this).data("type") === "edit"){
					me.display($(this).data("url"), false);		
				}else{
					me.display($(this).data("url"), true);
				}
			});

			$("#md").on("click", "#form-sub", function(event){
				event.preventDefault();
				me.newArticle(event);
			});
		},

		requestJson: function(callback){
			var me = this;	
			var jsonRequest = $.ajax(me.localurl + "/menu.json")
			.done(function(){
				if (callback){
					$("#articles").html("");
					callback.call(me, jsonRequest.responseJSON.menu);	
				}else{
					console.log("probably forgot to pass callback");
					return(jsonRequest.responseJSON.menu);
				}
			})
			.fail(me.errorAjax);
		},

		getArticles: function(menu){
			this.selectorArticles.html();
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
					app.semanticSettings();
				}
			})
			.fail(app.errorAjax);
		},

		newArticle: function(event){
			var me = this;
			var $form = $('#form-new');
			var title =  $form.form('get value', 'title');
			console.log(title);
			console.log($('#form-new').form('is valid'));
		
		/*	var titleArticle = $("#title").val();
			var contentMd = $("#text-article").val();
			var urlTitle = this.localurl + "/ressources";
			

			var postForm = $.ajax({
				method: "POST",
				url: urlTitle,
				data: {article: contentMd, title: titleArticle, path: '/' + titleArticle + ".md" },
				success: function(){
					me.greatSuccess(postForm);
				},
			});*/
		},

		semanticSettings: function(){
			$('.ui.dropdown').dropdown();
			$('#form-new')
			.form({
				fields: {
					title: {
						identifier: 'title',
						rules: [
						{
							type   : 'empty',
							prompt : 'Please enter a title'
						},
						{
							type   : 'maxLength[25]',
							prompt : 'Your title must not be more than 25 characters'
						}
						]
					},
					text: {
						identifier: 'text-article',
						rules: [
						{
							type   : 'minLength[10]',
							prompt : 'Your article must be 10 characters long at least'
						}
						]
					},
				}
			});
		},

		errorAjax: function(){console.log("In fail method, something went wrong");},

		greatSuccess: function(jqXHR){
			console.log(jqXHR,"greatSuccess")
		},
	};

	$(document).ready(function(){
		app.init();
	});
})();	