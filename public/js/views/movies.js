// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.MovieThumb = Backbone.View.extend({

	events: {
		"click input[name='sortOrderTitle']" : "sortTitle",
		"click input[name='sortOrderDirector']" : "sortDirector",
        "mouseover a[id='ordering']" : "showMenu", 
        "mouseover div[id='orderDiv']" : "showMenu",
        "mouseleave a[id='ordering']" : "hideMenu",
        "mouseleave div[id='orderDiv']" : "hideMenu",
        "change input[type='radio']" : "sortOrder" 
    },

    // render the View
    render: function () {

    	this.collection.comparator = function(movie) {
        	return movie.get('title'); // ADD CODE to select comparator field
		};
		// sort collection before rendering it - implicitly uses comparator
		this.collection.sort();

		this.collection.comparator = function(movie) {
		    return movie.get('director'); // ADD CODE to select comparator field
		};
		// sort collection before rendering it - implicitly uses comparator
		this.collection.sort();
    	// comparator function on collection is the basis for comparing movie
		// models

		// set the view element ($el) HTML content using its template

		// var template = _.template("<h2>TESTING <%= name %></h2>");
		// console.log(this.collection);
		// this.collection.each(function(model){
		// 	console.log(model.toJSON());
		// })

		//loads template(needed for non name matching templates)
		var movieThumbLoad = $.get('tpl/MovieThumb.html');
		//will need to get access to splat from inside anon. function
		var self = this;

		movieThumbLoad.done(function(markup) {
		  // Now "markup" contains the response to the $.get() request.
		  // Turn this markup into a function using Underscore's
		  // template() // function.
		  // Finally apply the moviesTemplate shown below to your
		  // movies collection and the template function you just created.

		  //change into easy to work with form
		  self.template = _.template(markup);

		  // console.log(markup, movieThumbLoad );
		  // console.log(self.model.toJSON(),self.template);
		  //to store the result to display
		  self.display = ''
		  // console.log( self.template(self.model.toJSON()) );
		  self.collection.each(function(model){
		  		//add the movie model html to display
		  		self.display = self.display + self.template( model.toJSON());
		  });

		   //actually display it
		   self.$el.html( self.display);
		});

		// this.$el.html( template() );
		return this;    // support method chaining
    }

});