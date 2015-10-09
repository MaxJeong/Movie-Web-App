// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// Define Backbone router
splat.AppRouter = Backbone.Router.extend({

    // Map "URL paths" to "router functions"
    routes: {
        "": "home",
        "about": "about",
        "movies": "movies",
        "movies/add": "details",
        "movies/:id": "edit"
    },

    // When an instance of an AppRouter is declared, create a Header view
    initialize: function() {
	// instantiate a Header view
        this.headerView = new splat.Header();  
	// insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);
        splat.collection = new splat.Movies();
        splat.collection.fetch();
    },

    //load home view, and select the nav bar
    home: function() {
	// If the Home view doesn't exist, instantiate one
        if (!this.homeView) {
            this.homeView = new splat.Home();
        };

        //highlights item in headerView
        this.headerView.selectMenuItem('.home-menu');
	    // insert the rendered Home view element into the document DOM
        $('#content').html(this.homeView.render().el);
    },

    //load about and select about button
    about: function() {
        //check if already created
        if (!this.aboutView) {
            this.aboutView = new splat.About();
        };
        //highlights item in headerView        
        this.headerView.selectMenuItem('.about-menu');
    // insert the rendered Home view element into the document DOM
        $('#content').html(this.aboutView.render().el);
    },
    // loads movie collection view
    movies: function() {
        // var my_model = new splat.Movie();
        if (!splat.collection){
            var my_collection = new splat.Movies();
            my_collection.fetch();
            console.log("failed to load from global instance of collection");
        }else{
            var my_collection = splat.collection;
        }
       

        //generating test models for use
        // var names = ["Alpha", "Beta", "Charlie", "Delta", "Epsilon"];
        // names.map(function(name){
        //     var testModel = new splat.Movie({title:name});
        //     my_collection.create(testModel);
        // });
        // console.log(my_model);
        // console.log(my_collection);
        //
        if (!this.moviesView) {
            //why is it nessary to supply the collection to the constructor
            this.moviesView = new splat.MovieThumb({collection:my_collection});
        };
        //highlights item in headerView
        this.headerView.selectMenuItem('.browse-menu');
        $('#content').html(this.moviesView.render().el);
    },

    details: function() {
        console.log(splat.collection);
        if (!this.detailsView) {
            this.detailsView = new splat.Details();
        };
        this.headerView.selectMenuItem('.details-menu');
        $('#content').html(this.detailsView.render().el);
    },

    edit:function(id){
        this.details();
        console.log(splat.collection);
    }


});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'Details'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});
