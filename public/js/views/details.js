// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
		//add event to check if user leaves without saving
		"click #moviesave ": "save",
		"click #moviedel ": "delete",
		"focusout input":"update"
	},

	

	//updates the model in the collection, if there isn't one, create it
	save:function(event){
		// console.log('trying to save');
		// console.log(splat.collection);


		var my_collection = splat.collection;
		

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
		console.log(this.newMovie);
		// console.log(my_collection);
		//splat.collection.add(newMovie);

		
		console.log(this.newMovie.attributes);
		if(this.isNew){
			//thus we create
			console.log('creating!');
			my_collection.create(this.newMovie, { 
            wait : true, 
            success : function (model,response) {
                // console.log('success',model);
                splat.utils.showNotice('success','operation complete');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
            	splat.utils.showNotice('danger','operation complete');
				console.log('fail',model);
            }
     
		}       );
	}else{
			console.log('saving!');
			this.newMovie.save(null,{ 
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
		}
		this.newMovie = null;
		this.isNew = null;
			
	},

	//delete model in collection, prompt user to double check,
	//return to browse view when done
	delete:function(event){
		//check if model is associated with this view
		if(!this.newMovie){
			//if it doesn't exist already
			//return
		}else{
			var my_collection = splat.collection;
			this.newMovie.destroy({
				wait:true,
				success : function (model,response) {
                console.log('deleted',model);
                utils.showNotice('success');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
				console.log('failed to delete',model);
            }

			});
		}

	},

	//updates local model
	update:function(event){
		var item = $(event.currentTarget);
		if(this.validate(item)){
			var name = item.attr('name');
			var val = item.val();
			var input = {};
			input[name] = val;
			this.newMovie.set(input);
			console.log(this.newMovie);
		}else{
			//error handling for part 3
		}
		// console.log(item);

	},

	//validator, validates fields,may require multiple functions,
	validate:function(item){
		//placeholder
		return true;
	},

    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());

	this.notify={ 
            wait : true, 
            success : function (model,response) {
                // console.log('success',model);
                splat.utils.showNotice('success','operation complete');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
            	splat.utils.showNotice('danger','operation complete');
				console.log('fail',model);
            }
    };
	//initalize model
	if (!this.newMovie){
		this.newMovie = new splat.Movie();
		this.isNew = true;
	}

	

	return this;    // support method chaining
    }

});