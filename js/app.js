(function(){
	"use strict";
	var app = {

		localurl: "http://192.168.43.133:8080",
		selectorMD: $("#md"),
		selectorArticles: $("#articles"),
		selectorDrop: $("#edit-drop"),
		selectorDropList: $("#drop-list"),

		init:function(){
			this.requestJson(this.getArticles);
			this.listeners();
			this.semanticSettings();
		},

		//UN SLUG!!!<<<<-----------------------
		//verif si bel et bien eu modif avant de post?
		//delete un article

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
				var articleToEdit = $(".search.dropdown .selected").data("value")
				if(articleToEdit){
					me.display(formUrl, false, articleToEdit);
				}
			});

			$("#md").on("click", "#sub", function(event){
				event.preventDefault();
				var articleToEdit = $("#title").data("article");
				if(articleToEdit || articleToEdit === 0){
					me.writeArticle(articleToEdit);	
				}else{
					me.writeArticle();
				}
			});

			$("#drop-list").on("click", "div", function(){
				var articleNumb = $(this).data("drop_number");
				console.log(articleNumb);
				me.requestJson(me.getUrl, articleNumb);
			});
		},

		requestJson: function(callback, articleNumb){
			var me = this;	
			var jsonRequest = $.ajax(me.localurl + "/menu.json")
			.done(function(){
				if (callback && articleNumb){
					callback.call(me, jsonRequest.responseJSON.menu, articleNumb);
				}else if(callback){
					callback.call(me, jsonRequest.responseJSON.menu);
				}else{
					console.log("probably forgot to pass callback");
					return(jsonRequest.responseJSON.menu);
				}
			})
			.fail(me.errorAjax, (callback)=>{console.log("tout casse",callback);});
		},

		getArticles: function(menu){
			this.selectorArticles.html("");
			this.selectorDrop.html("");
			this.selectorDropList.html("");
			var len = menu.length;
			var last ='<div class="item">Last articles :</div>';
			var option = '<option value="">Edit an article</option>';
			this.selectorArticles.html("");
			for(var i = 0; i < len; i++){
				var url = this.localurl + menu[i].path;
				var title = menu[i].title;
				var anchorArticle = "<a class='item link' data-url='" + url + "'>" + title + "</a>";
				var dropArticle = '<option value="'+i+'">'+title+'</option>';
				var item = '<div class="item" data-drop_number="'+ i +'">'+ title +'</div>';
				this.selectorDrop.append(dropArticle);
				this.selectorArticles.append(anchorArticle);
				this.selectorDropList.append(item);
			}
			this.selectorArticles.prepend(last);
			this.selectorDrop.prepend(option);
		},

		display: function(url, isMarkdown, articleToEdit){
			var me = this;
			var converter = new showdown.Converter();
			var jqXHR = $.ajax(url)
			.done(function(){
				if(isMarkdown === true){
					var convertedToHtml = converter.makeHtml(jqXHR.responseText);
					me.selectorMD.html(convertedToHtml);
				}else if (articleToEdit){
					me.requestJson(me.fillEditForm, articleToEdit);
					me.selectorMD.html(jqXHR.responseText);
					me.semanticSettings();
				}else{
					me.selectorMD.html(jqXHR.responseText);
					me.semanticSettings();
				}
			})
			.fail(me.errorAjax);
		},

		getUrl: function(menu, articleNumb){
			var url =  this.localurl + menu[articleNumb].path;
			console.log(url);
			this.display(url, true);
		},

		writeArticle: function(articleToEdit){
			var me = this;
			var $form = $('#form')
			if ($form.form('is valid')){
				var titleArticle =  $form.form('get value', 'title');
				var contentMd = $form.form('get value', 'text-article');
				var urlTitle = this.localurl + "/ressources";
				if (articleToEdit){
					var bodyRequest = {article: contentMd, title: titleArticle, path: $("#title").data("path") , articleToEdit: articleToEdit};
				}else{
					var bodyRequest = {article: contentMd, title: titleArticle, path: '/' + titleArticle + ".md" , articleToEdit: toEdit };
				}
				console.log(bodyRequest);
				var postForm = $.ajax({
					method: "POST",
					url: urlTitle,
					data: bodyRequest,
					success: function(){
						console.log("dans write ajax");
						me.greatSuccess(postForm);
						me.requestJson(me.getArticles);
					},
				});
			}
		},

		fillEditForm: function(menu, articleToEdit){
			var me = this;
			var title = menu[articleToEdit].title;
			var urlArticle = me.localurl +  menu[articleToEdit].path;
			var jqXHR = $.ajax(urlArticle)
			.done(function(data){
				$("#text-article").val(data);
				$("#title").val(title);
				$("#title").data("article",articleToEdit);
				$("#title").data("path",menu[articleToEdit].path);
			})
			.fail(me.errorAjax);
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