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


		var my_collection = splat.collection;
		this.newMovie = new splat.Movie();

		//this is evaluated to the items in the for loop
		//so rename to self for now.
		var self = this;

		//get all the inputs with text type
		$("input[type='text']").each(function(item){
			
			var name = $(this).attr('name');
			var val = $(this).val();
			
			var input = {};
			//javascript will interpet keys litteraly,so 
			//get around it by below notation
			//lol spelling
			input[name] = val;

			// set takes in dictionary,thus why we created input
			self.newMovie.set(input);
			// console.log(title,val);
			// var newMovie = new splat.Movie({})
		});
		// console.log(newMovie);
		console.log(my_collection);
		//splat.collection.add(newMovie);
		my_collection.create(this.newMovie, { 
            wait : true, 
            success : function (model,response) {
                console.log('success',model);
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
				console.log('fail',model);
            }
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
