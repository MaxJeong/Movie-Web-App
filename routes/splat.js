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
            res.status(402).send("Sorry, that review doesn't exist;");
        } else {
            res.status(200).send(review);
        }
    });
};

exports.getReviews = function(req, res) {
    // var review = new ReviewModel({reviewName:'addison'});
    // review.movieId = req.params.id;
    // review.save();


    console.log("in reviews");
    console.log('looking for',req);

    ReviewModel.find( {movieId:req.params.id} ,function(err, review) {
        
        if (err) {
            res.status(500).send("Sorry, unable to retrieve reviews at this time (" 
                +err.message+ ")" );
        } else if (!review) {
            res.status(402).send("Sorry, that review doesn't exist;");
        } else {
            res.status(200).send(review);
        }
    });
};


// retrieve an individual movie model, using it's id as a DB key
exports.getMovie = function(req, res) {
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
    // console.log('Hello!');
    // console.log(req);
    // console.log(res);
    
    MovieModel.find(function(error, movies) {
        if (!error) {
            res.status(200).send(movies);
        } else {
            res.status(401).send("Sorry, no movies found " + 
                error.message);
        }
    });
};

//add single movie
exports.addMovie = function(req, res) {
    var m = new MovieModel(req.body);
    var path = '/cmshome/jeongse9/cscc09f15_space/public/img/uploads/'
    var name = m.id;
    var image_path = path + name + '.jpeg';
    var image = fs.open(image_path, 'w', function(err, fd) {
        if (err) {
            res.status(500).send("Sorry, unable to save image at this time (" 
                +err.message+ ")" );
        } else {
            var base64Data = req.body.poster.replace(/^data:image\/jpeg;base64,/, "");
            fs.writeFile(image_path, base64Data, 'base64', function(err) {
                console.log(err);
                m.poster = 'img/uploads/' + name + '.jpeg';
                m.save(null,{ 
                    wait : true, 
                    success : function (model, response) {
                        console.log('success',model);
                        //consider navigating to movie page
                        splat.utils.showNotice('success','operation complete');
                        splat.app.navigate('#', {replace:true, trigger:true});
                    },
                    fail: function(model, response) {
                        console.log('fail',model);
                        splat.utils.showNotice('danger','could not save');
                    }
                });
                fs.close(fd);
            });
            // res.status(200).send(movie);
        }
    });

    console.log('in addMovie');
    console.log(req.body);

    //likely need a callback function here
    //m.save();
    
};

exports.editMovie = function(req,res) {
    console.log('in editMovie');
    console.log(req.params);
    // console.log(res.body);
    MovieModel.findById(req.params.id, function(err, movie) {
        var m = new MovieModel(movie);
        console.log(m,movie);

        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(400).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            var path = '/cmshome/jeongse9/cscc09f15_space/public/img/uploads/'
            var name = m.id;
            var image_path = path + name + '.jpeg';
            var image = fs.open(image_path, 'w', function(err, fd) {
                if (err) {
                    res.status(500).send("Sorry, unable to save image at this time (" 
                        +err.message+ ")" );
                } else if (image) {
                    fs.unlink(image_path);
                    var base64Data = req.body.poster.replace(/^data:image\/jpeg;base64,/, "");
                    fs.writeFile(image_path, base64Data, 'base64', function(err) {
                        //console.log(err);
                        m.set('poster', 'img/uploads/' + name + '.jpeg');
                        m.save();
                    });
                } 
                
                // m.save(function(err, movie) {
                //     if (err) {
                //         res.status(500).send("Sorry, unable to save movie at this time");
                //     } else {
                //         res.status(200).send(movie);
                //     }
                // });
                // fs.close(fd);
                
            });
            // res.status(200).send(movie);
        }
    });
    
};

exports.deleteMovie = function(req,res) {
    MovieModel.findById(req.params.id, function(err, movie) {
        console.log(m);
        console.log(movie);
        var m = new MovieModel(movie);
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(400).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            var path = '/cmshome/jeongse9/cscc09f15_space/public/img/uploads/'
            var name = m.id;
            var image_path = path + name + '.jpeg';
            var image = fs.open(image_path, 'w', function(err, fd) {
                if (err) {
                    res.status(500).send("Sorry, unable to remove image at this time (" 
                        +err.message+ ")" );
                } else if (image) {
                    fs.unlink(image_path);
                    fs.close(fd);
                } 
            });

            m.remove();
            // res.status(200).send(movie);
        }
    });
};

// console.log(exports.editMovie);
// NOTE, you would use this module only if you chose to implement
// image upload using Blobs with the HTML5 API.  If instead your
// server saves images directly from your model's poster value,
// you do NOT need this route handler

// upload an image file; returns image file-path on server
/*
exports.uploadImage = function(req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files. ...   // ADD CODE to get file path
        fileType = req.files. ...   // ADD CODE to get MIME type
        // extract the MIME suffix for the user-selected file
        suffix = // ADD CODE
        // imageURL is used as the value of a movie-model poster field 
    // id parameter is the movie's "id" attribute as a string value
        imageURL = 'img/uploads/' + req.params.id + suffix,
        // rename the image file to match the imageURL
        newPath = __dirname + '/../public/' + imageURL;
    fs.rename(filePath, newPath, function(err) {
        if (!err) {
            res.status(200).send(imageURL);
        } else {
            res.status(500).send("Sorry, unable to upload poster image at this time (" 
                +err.message+ ")" );
    }
    });
};
*/

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
var ReviewModel = mongoose.model('Review',ReviewSchema);
