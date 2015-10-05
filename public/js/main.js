// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// Define Backbone router
splat.AppRouter = Backbone.Router.extend({

    // Map "URL paths" to "router functions"
    routes: {
        "": "home",
        "about": "about",
        "movies": "movies"
    },

    // When an instance of an AppRouter is declared, create a Header view
    initialize: function() {
	// instantiate a Header view
        this.headerView = new splat.Header();  
	// insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);
    },

    //load home view, and select the nav bar
    home: function() {
	// If the Home view doesn't exist, instantiate one
        if (!this.homeView) {
            this.homeView = new splat.Home();
        };
	// insert the rendered Home view element into the document DOM
        this.headerView.selectMenuItem('.home-menu');
        $('#content').html(this.homeView.render().el);
    },

    //load about and select about button
    about: function(){
        //check if already created
        if (!this.aboutView) {
            this.aboutView = new splat.About();
        };
        
        this.headerView.selectMenuItem('.about-menu');
    // insert the rendered Home view element into the document DOM
        $('#content').html(this.aboutView.render().el);
    },

    movies: function(){
        if (!this.moviesView) {
            this.moviesView = new splat.MovieThumb();
        };

        this.headerView.selectMenuItem('.browse-menu');
        $('#content').html(this.moviesView.render().el);
    }

});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'MovieThumb'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});
