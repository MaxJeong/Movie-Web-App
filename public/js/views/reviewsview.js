// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.ReviewThumb = Backbone.View.extend({

	events: {
		"click #reviewsave ": "reviewSave"
	},

	reviewSave:function(event) {
		var review = this.createReview;

		var collection = splat.collection;

		collection.create(review);

		success : function (model, response) {
	        //splat.utils.showNotice('success','operation complete');
	        //splat.app.navigate('#', {replace:true, trigger:true});
	    },
	    fail: function(model, response) {
	        //console.log('fail',model);
	        //splat.utils.showNotice('danger','could not save');
	    }

	    location.reload();
	},

	// ReviewsView object listens to reviews
	// collection for “sync” events, calling
	// showScore() when event occurs
	//this.listenTo(this.reviews, "sync", this.showScore);
	//this.listenTo(this.reviews, "sync", this.renderReviews);

	createReview:function() {
		reviewText = $('.reviewText').val();
		reviewName = $('.reviewName').val();
		reviewAffil = $('.reviewAffil').val();
		movieId = movie.id;
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