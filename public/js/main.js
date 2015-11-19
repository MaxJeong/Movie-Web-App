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
        "movies/:id": "edit",
        "movies/:id/reviews": "review"
    },

    // When an instance of an AppRouter is declared, create a Header view
    initialize: function() {
        splat.collection = new splat.Movies();
        splat.collection.fetch();
        // splat.reviews = new splat.Reviews();
        // splat.reviews.fetch();

        // instantiate a Header view
        this.headerView = new splat.Header();  
        // insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);
        //create collection and retrieve values
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
            //only using to old code,fyi
            var my_collection = splat.collection;
        }
       
        //generating test models for use
        // var names = ["Alpha", "Beta", "Charlie", "Delta", "Epsilon"];
        // names.map(function(name){
        //    var testModel = new splat.Movie({title:name});
        //    my_collection.create(testModel);
        // });
        //console.log(my_model);
        //console.log(my_collection);
        
        // if (!this.moviesView) {
            //why is it nessary to supply the collection to the constructor
            this.moviesView = new splat.MovieThumb({collection:splat.collection});
        // };
        //highlights item in headerView
        this.headerView.selectMenuItem('.browse-menu');
        $('#content').html(this.moviesView.render().el);
    },

    //load up a movie details page
    details: function() {
        // console.log(splat.collection);
        if (!this.detailsView) {
            this.detailsView = new splat.Details();
        };
        //events detach after first use,need to reattch
        this.detailsView.delegateEvents();

        this.headerView.selectMenuItem('.details-menu');
        $('#content').html(this.detailsView.render().el);
    },

    //like the details page, but for already existing movies
    edit:function(id){
        //edit is same as details,but with filled in values
        // console.log(id);
    
        var my_collection = new splat.Movies();
        var rev = my_collection.fetch();
        var self = this;
        
        this.details();

        rev.done(function(){
            var k;
            var select;
            var current = splat.collection.get(id);
            // console.log(splat);
            console.log(splat.collection);
            // console.log(current);

            
            for (k in current.attributes){
                // console.log(current.attributes[k]);

                //select input fields based on model
                select = "input[name='"+ k+ "'][type='text']";
                //insert values into field
                $(select).val(current.attributes[k]);            
            }
            $('#displayimg').attr('src',current.attributes.poster);
            // console.log(current.attributes.poster);

            // //keep a reference to model in detailsView
            self.detailsView.newMovie = current;
            self.detailsView.isNew = false;

        });


        
        
    },

    review:function(id){
        // console.log(splat.collection);
        //check if movie has review item
        console.log(id);

        var reviews = new splat.Reviews(id);
        reviews.fetch();
        console.log(reviews);
        //get it, then send to view for processing

        if (!this.reviewView) {
            this.reviewView = new splat.ReviewThumb();
        };
        this.reviewView.reviews = reviews;

        var review = new splat.Review();
        review.url = '/movies/' + id + '/reviews';
        this.reviewView.review = review;

        // var names = ["Alpha", "Beta", "Charlie", "Delta", "Epsilon"];
        // names.map(function(name){
        //     var testModel = new splat.Reviews({reviewName:name});
        //     splat.reviews.create(testModel);
        // });
        //console.log(my_model);
        //console.log(my_collection);
        
        this.headerView.selectMenuItem('.details-menu');
        $('#content').html(this.reviewView.render().el);
    }



});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'Details'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});
