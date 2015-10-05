// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.MovieThumb = Backbone.View.extend({

    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	// console.log(this);
	// console.log(this.template);
	// console.log(splat.model);
	// console.log(splat.Movies.model);
	// console.log(splat.Movies);
	// console.log(splat.Movie);
	// console.log(this.model);
	// console.log(this.model.toJSON());
	// console.log(this.template(this.model.toJSON()));
	// var template = _.template("<h2>Hello <%= name %></h2>");

	 
	var movieThumbLoad = $.get('tpl/MovieThumb.html');

	var self = this;
	movieThumbLoad.done(function(markup) {
	  // Now "markup" contains the response to the $.get() request.
	  // Turn this markup into a function using Underscore's
	  // template() // function.
	  // Finally apply the moviesTemplate shown below to your
	  // movies collection and the template function you just created.

	  self.template = _.template(markup);

	  console.log(markup, movieThumbLoad ,self.model.toJSON(),self.template);
	  
	  console.log( self.template(self.model.toJSON()) );
	  console.log( self.template() );

	// console.log(self);
	
	   self.$el.html( self.template(self.model.toJSON()));
	});
	// this.$el.html(this.template());
	return this;    // support method chaining
    }

});
