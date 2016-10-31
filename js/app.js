(function(){
	"use strict";
	var app = {

		localurl: "http://88.160.12.89:8080",
		selectorMD: $("#md"),
		selectorArticles: $("#articles"),
		selectorDrop: $("#edit-drop"),

		init:function(){
			this.requestJson(this.getArticles);
			this.listeners();
			this.semanticSettings();
		},

		listeners: function(){
			var me = this;
			$("#global-menu").on("click", "a", function(){
				$("a").removeClass("active");
				$(this).addClass("active");
				if($(this).data("type") === "form"){
					me.display($(this).data("url"), false);
				}else{
					me.display($(this).data("url"), true);
				}
			});

			$("#edit-button").on("click", function(){
				var formUrl = $(this).data("url");
				var urlToEdit = $(".search.dropdown .selected").data("value")
				if(urlToEdit){
					console.log(urlToEdit);
					me.display(formUrl, false, urlToEdit);
				}
			});

			$("#md").on("click", "#form-sub", function(event){
				event.preventDefault();
				me.newArticle(event);
			});

			$("#md").on("click", "#sub-edit", function(event){
				event.preventDefault();
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
			var last ='<div class="item">Last articles :</div>'
			for(var i = 0; i < len; i++){
				var url = this.localurl + menu[i].path;
				var title = menu[i].title;
				var anchorArticle = "<a class='item link' data-url='" + url + "'>" + title + "</a>";
				var dropArticle = '<option value="'+url+'">'+title+'</option>';
				this.selectorDrop.append(dropArticle);
				this.selectorArticles.append(anchorArticle);
			}
			this.selectorArticles.prepend(last);
		},

		display: function(url, isMarkdown, urlToEdit){
			var me = this;
			var converter = new showdown.Converter();
			var jqXHR = $.ajax(url)
			.done(function(){
				if(isMarkdown === true){
					var convertedToHtml = converter.makeHtml(jqXHR.responseText);
					me.selectorMD.html(convertedToHtml);
				}else{
					me.selectorMD.html(jqXHR.responseText);
					me.getFormValue(urlToEdit);
					me.semanticSettings();
				}
			})
			.fail(me.errorAjax);
		},

		newArticle: function(event){
			var me = this;
			var $form = $('#form-new')
			console.log($('#form-new').form('is valid'));
			if ($form.form('is valid')){
				var $form = $('#form-new');
				var titleArticle =  $form.form('get value', 'title');
				var contentMd = $form.form('get value', 'text-article');
				var urlTitle = this.localurl + "/ressources";

				var postForm = $.ajax({
					method: "POST",
					url: urlTitle,
					data: {article: contentMd, title: titleArticle, path: '/' + titleArticle + ".md" },
					success: function(){
						me.greatSuccess(postForm);
						me.requestJson(me.getArticles);
					},
				});
			}
		},

		getFormValue: function(urlToEdit){
			var me = this;
			if ($("#form-edit")[0]){
				var jqXHR = $.ajax(urlToEdit)
				.done(function(data){
					$("#text-article").val(data);
				})
				.fail(me.errorAjax);
			}
		},

		semanticSettings: function(){
			$('.ui.dropdown').dropdown();
			$('.form')
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