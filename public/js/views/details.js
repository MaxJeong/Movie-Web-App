// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
		//add event to check if user leaves without saving
		"click #moviesave ": "save",
		"click #moviedel ": "delete"

	},

	//updates the model in the collection, if there isn't one, create it
	save:function(event){
		// console.log('trying to save');
		// console.log(splat.collection);
		

		$("input[type*='text']").each(function(item){
			console.log($(this).attr('name'));
			// console.log(item.attr('name'));
		});
	},

	//delete model in collection, prompt user to double check,
	//return to browse view when done
	delete:function(event){

	},

	//validator, validates fields,may require multiple functions,


    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());
	return this;    // support method chaining
    }

});
