// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.ReviewThumb = Backbone.View.extend({

	events: {
		"click #reviewsave": "reviewSave",
		"click .freshOrRotten": "freshSave"
	},

	freshSave:function(save) {
		var self = this;
		self.input = {};

		var current = event.target;

		if (current.id == 'fresh') {
			self.input[current.name] = current.value;
		} else if (current.id == 'rotten') {
			self.input[current.name] = current.value;
		}
		console.log(self.review);
		console.log(self.review.freshness);
		console.log(self.input);
	},

	reviewSave:function(event) {
		var collection = splat.collection;
		var self = this;
		// var input = {};
		if (!self.input){
			self.input = {};
		}

		var name = $('textarea[type="text"]').attr('name');
		var val = $('textarea[type="text"]').val();
		self.input[name] = val;
		// console.log(name);
		// console.log(val);
		console.log(self.input);

		//get all the inputs with text type
		$('input[type="text"]').each(function(item){
			console.log("in review save func")
			var name = $(this).attr('name');
			var val = $(this).val();
			console.log(name);
			console.log(val);
			
			//javascript will interpet keys litteraly,so 
			//get around it by below notation
			self.input[name] = val;
			console.log(self.input[name]);
			console.log(self.input);

			// set takes in dictionary,thus why we created self.input
			console.log(self.review);
			self.review.set(self.input);
		});

		console.log(self.input);

		collection.create(this.review, { 
        wait: true, 
            success: function(model,response) {
                console.log('success',model);
            },
            fail: function(model, response) {
            	console.log('fail',model);
            }
		});

		// console.log(this.movie);
		// console.log(splat.collection);
		// console.log(splat.collection.get(id));
		// console.log(splat.collection.fetch());
	},

    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template

	// var template = _.template("<h2>TESTING <%= name %></h2>");
	// console.log(this.collection);
	// this.collection.each(function(model){
	// 	console.log(model.toJSON());
	// })
	
	//loads template(needed for non name matching templates)
	var reviewThumbLoad = $.get('tpl/ReviewThumb.html');
	//will need to get access to splat from inside anon. function
	var self = this;

	reviewThumbLoad.done(function(markup) {
	  	// Now "markup" contains the response to the $.get() request.
	  	// Turn this markup into a function using Underscore's
	  	// template() // function.
	  	// Finally apply the reviewsTemplate shown below to your
		// reviews collection and the template function you just created.
	  	var reviewForm = $.get('tpl/Reviewer.html');

	  	//change into easy to work with form
	  	self.template = _.template(markup);

	  	// console.log(markup, reviewThumbLoad );
	  	// console.log(self.model.toJSON(),self.template);
	  	//to store the result to display
	  	self.display = '';
	  	reviewForm.done(function(markup) {
	  		self.display = _.template(markup);
	  		self.display = self.display();
	  		console.log(markup);
	  		console.log(self.display);
	  		// console.log(splat.reviews);
		  	self.reviews.each(function(model){
		  		//add the review model html to display
		  		self.display = self.display + self.template( model.toJSON());
		  	});
		   	self.$el.html( self.display);
	  	});
	  	// console.log( self.template(self.model.toJSON()) );

	   	//actually display it
	});

	// this.$el.html( template() );
	return this;    // support method chaining
    }

});