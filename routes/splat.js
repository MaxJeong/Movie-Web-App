"use strict";
console.log("in splat");
var fs = require('fs'),
    // path is "../" since splat.js is in routes/ sub-dir
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    url = require("url");

// Implemention of splat API handlers:

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res) {
    res.status(200).send('<h3>Eatz API is running!</h3>');
};

//gets all reviews
exports.getReviewsNoID = function(req, res) {

    console.log("in reviewsNOID");
    ReviewModel.find( function(err, review) {
        console.log(review);
        if (err) {
            res.status(500).send("Sorry, unable to retrieve reviews at this time (" 
                +err.message+ ")" );
        } else if (!review) {
            res.status(402).send("Sorry, that review doesn't exist");
        } else {
            res.status(200).send(review);
        }
    });
};

exports.getReviews = function(req, res) {

    console.log("in reviews");
    console.log('looking for',req.params);

    ReviewModel.find( {movieId:req.params.id} ,function(err, review) {
        
        if (err) {
            res.status(500).send("Sorry, unable to retrieve reviews at this time (" 
                +err.message+ ")" );
        } else if (!review) {
            res.status(402).send("Sorry, that review doesn't exist");
        } else {
            res.status(200).send(review);
        }
    });
};


// retrieve an individual movie model, using it's id as a DB key
exports.getMovie = function(req, res) {
    console.log("in get movie");
    console.log(req.params.id);
    MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(402).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            res.status(200).send(movie);
        }
    });
};

//get all movies 
exports.getMovies = function(req, res) {
    console.log("MOVIES",req.params);
    
    MovieModel.find(function(error, movies) {
        if (!error) {
            res.status(200).send(movies);
        } else {
            res.status(401).send("Sorry, no movies found " + 
                error.message);
        }
    });
};

exports.addReview = function(req, res) {
    console.log("in add review");
    var r = new ReviewModel(req.body);
    r.movieId = req.params.id;
    console.log(req.params);
    r.save();
};

//add single movie
exports.addMovie = function(req, res) {
    console.log("in add movie");
    var m = new MovieModel(req.body);
    if (m.poster != "img/default.png") {
        var path = __dirname + '/../public/img/uploads/';
        var name = m.id;
        var image_path = path + name + '.jpeg';
        var image = fs.open(image_path, 'w', function(err, fd) {
            if (err) {
                res.status(500).send("Sorry, unable to save image at this time (" 
                    +err.message+ ")" );
            } else {
                var base64Data = req.body.poster.replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFile(image_path, base64Data, 'base64', function(err) {
                    m.poster = 'img/uploads/' + name + '.jpeg';
                    m.save(function(err, movie2) {
                        console.log("this is err",err);
                        if (err) {
                            res.status(500).send("Sorry, unable to save movie at this time");
                        } else {
                            res.status(200).send(movie2);
                        }
                    });
                    fs.close(fd);
                });
            }
        });
    } else {
        m.save(function(err, movie2) {
            console.log("this is err",err);
            if (err) {
                res.status(500).send("Sorry, unable to save movie at this time");
            } else {
                res.status(200).send(movie2);
            }
        });
    }
};

exports.editMovie = function(req,res) {
    console.log('in editMovie');
    console.log(req.body);
    delete req.body._id;
    // console.log(res.body);
    MovieModel.findByIdAndUpdate(req.params.id, req.body, function(err, movie) {
        console.log("this is movie",movie);
        console.log("this is err",err);
        if (err) {
            res.status(505).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(400).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            if (movie.poster != "img/default.png") {
                var path = __dirname + '/../public/img/uploads/';
                var name = movie.id;
                var image_path = path + name + '.jpeg';
                var image = fs.open(image_path, 'w', function(err, fd) {
                    if (err) {
                        res.status(500).send("Sorry, unable to save image at this time (" 
                            +err.message+ ")" );
                    } else {
                        fs.unlink(image_path);
                        var base64Data = req.body.poster.replace(/^data:image\/jpeg;base64,/, "");
                        fs.writeFile(image_path, base64Data, 'base64', function(err) {
                            movie.poster = 'img/uploads/' + name + '.jpeg';
                            movie.save(function(err, movie2) {
                                console.log("this is err",err);
                                if (err) {
                                    res.status(500).send("Sorry, unable to save movie at this time");
                                } else {
                                    res.status(200).send(movie2);
                                }
                            });
                        });
                    }
                });
            } else {
                movie.save(function(err, movie2) {
                    console.log("this is err",err);
                    if (err) {
                        res.status(500).send("Sorry, unable to save movie at this time");
                    } else {
                        res.status(200).send(movie2);
                    }
                });
            }
        }
    });
};

exports.deleteMovie = function(req,res) {
    console.log("in delete");
    MovieModel.findById(req.params.id, function(err, movie) {
        // console.log(m);
        console.log(movie);
        // var m = new MovieModel(movie);
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(400).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            movie.remove(function(err, movie2) {
                console.log("this is err",err);
                if (err) {
                    res.status(500).send(movie2 + "Sorry, unable to save movie at this time");
                } else {
                    res.status(200).send(movie2);
                }
            });
        }
    });
};

var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect('mongodb://' +config.dbuser+ ':' +config.dbpass+
                '@10.15.2.164/' + config.dbname);

// Schemas
var MovieSchema = new mongoose.Schema({
    title: { type: String, required: false },
    released: { type: Number, required: false },
    director: { type: String, required: false },
    starring: { type: [String], required: false },
    rating: { type: String, required: false },
    duration: { type: Number, required: false },
    genre: { type: [String], required: false },
    synopsis: { type: String, required: false },
    freshTotal: { type: Number, required: false },
    freshVotes: { type: Number, required: false },
    trailer: { type: String },
    poster: { type: String, required: false },
    dated: { type: Date, required: false }
});

var ReviewSchema = new mongoose.Schema({
    freshness: { type: Number, required: false },
    reviewText: { type: String, required: false },
    reviewName: { type: String, required: false },
    reviewAffil: { type: String, required: false },
    movieId: { type: String, required: false }  
});

// Constraints
// each title:director pair must be unique; duplicates are dropped
MovieSchema.index({title: 0, director: 2}, {unique: true, dropDups: true});

// Models
var MovieModel = mongoose.model('Movie', MovieSchema);
var ReviewModel = mongoose.model('Review', ReviewSchema);
