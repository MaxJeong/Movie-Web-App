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
		"focusout input":"update",
		// "ondragover #movieimg":"drop",
		// "drop #movieimg":"drop",
		// 'mousedown body': 'drop',
		// 'dragstart body': 'drop',
		// 'dragend body': 'drop',
		// // Handle drop
		// 'dragenter body': 'drop',
		// 'dragleave body': 'drop',
		'drop body': 'drop'
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
            	splat.utils.showNotice('danger','could not save');
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
                splat.utils.showNotice('success','operation complete');
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
				console.log('fail',model);
				splat.utils.showNotice('danger','could not save');
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
			splat.app.navigate('#', {replace:true, trigger:true});
		}else{
			var my_collection = splat.collection;
			this.newMovie.destroy({
				wait:true,
				success : function (model,response) {
                console.log('deleted',model);
                splat.utils.showNotice('success','operation complete');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
				console.log('failed to delete',model);
				splat.utils.showNotice('danger','could not delete');
            }

			});
		}

	},

	//updates local model
	update:function(event){
		var item = $(event.currentTarget);
		
		console.log(item.attr('id'));
		splat.utils.hideValidationNotice(item);
		console.log(item.attr('name'));

		splat.utils.showNotice('info','Remember to click Save Changes Button');
		if (this.newMovie.validateCheck(item)) {
			//console.log('IS VALID');
			var name = item.attr('name');
			var val = item.val();
			var input = {};
			input[name] = val;
			this.newMovie.set(input);
			console.log(this.newMovie);
		}
		else {
			//console.log('IS NOTs VALID');
			var name = item.attr('name');
			var msg;
			if (name == 'title') {
				msg = "Only 1 or more letters-digits-spaces allowed"
			}
			else if (name == 'released') {
				msg = "Released must be between 1910 and 2016"
			}
			else if (name == 'director') {
				msg = "You must enter a director's name"
			}
			else if (name == 'rating') {
				msg = "You must enter either G, PG, PG-13, R, or NC-17"
			}
			else if (name == 'starring') {
				msg = "You must enter starring with one or more comma seperated sequences of whitespace-seperated words"
			}
			else if (name == 'duration') {
				msg = "Duration must be between 0-999"
			}
			else if (name == 'genre') {
				msg = "You must enter genre with one or more comma seperated sequences of whitespace-seperated words"
			}
			else if (name == 'synopsis') {
				msg = "Must contain some text"
			}
			else if (name == 'trailer') {
				msg = "Must be in proper URL format (e.g. http://www.example.com)"
			}
			splat.utils.showValidationNotice(item,msg);
			//error handling for part 3
		}
		// console.log(item);

	},

	 allowDrop:function(ev) {
    ev.preventDefault();
    console.log('in allowDrop');
},

	drag: function(ev)  {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log('in drag');
},

	drop: function(ev) {
	console.log('in Drop');
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
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