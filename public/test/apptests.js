QUnit.jUnitReport = function(report) {
    console.log(report.xml);   // send XML output report to console
}
QUnit.module('Pre supplied tests', {
   setup: function() {},
   teardown: function() {}

});

 test('Check model initialization parameters and default values', function() {

  //create a new instance of a User model 
  var user = new splat.User({username: "Noah", password: "Jonah"});
  // test that model has parameter attributes
  equal(user.get("username"), "Noah", "User title set correctly");
  equal(user.get("password"), "Jonah", "User director set correctly");

  // test that Movie model has correct default values upon instantiation
  var movie = new splat.Movie();
  equal(movie.get("poster"), "img/placeholder.png",
	"Movie default value set correctly");
 });

 test( "Inspect jQuery.getJSON's usage of jQuery.ajax", function() {
    this.spy( jQuery, "ajax" );
    var getJSONDone = jQuery.getJSON( "/movies" );
    ok( jQuery.ajax.calledOnce );
    equal( jQuery.ajax.getCall(0).args[0].url, "/movies" );
    equal( jQuery.ajax.getCall(0).args[0].dataType, "json" );
  });

 test("Fires a custom event when the state changes.", function() {
    var changeModelCallback = this.spy();
    var movie = new splat.Movie();
    movie.bind( "change", changeModelCallback );
    movie.set( { "title": "Interstellar" } );
    ok( changeModelCallback.calledOnce,
	"A change event-callback was correctly triggered" );
  });

 test("Test movie model/collection add/save, and callback functions.", function(assert) {
    assert.expect(4);   // 4 assertions to be run
    var done1 = assert.async();
    var done2 = assert.async();
    var errorCallback = this.spy();
    var movie = new splat.Movie({"__v":0,
        "dated":"2015-10-21T20:44:27.403Z",
	"director":"Sean Penn",
    "duration":109,
    "freshTotal":18,
    "freshVotes":27,
	"poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
	"rating":"R"
    ,"released":"1999",
    "synopsis":"great thriller",
	"title":"Zorba Games",
    "trailer":"http://archive.org",
	"userid":"54635fe6a1342684065f6959",
    "genre":["action"],
	"starring":["Bruce Willis,Amy Winemouse"]});  // model
    var movies = new splat.Movies();  // collection
    // verify Movies-collection URL
    equal( movies.url, "/movies",
		"correct URL set for instantiated Movies collection" );
    // test "add" event callback when movie added to collection
    var addModelCallback = this.spy();
    movies.bind( "add", addModelCallback );
    movies.add(movie);
    ok( addModelCallback.called,
		 "add callback triggered by movies collection add()" );

    console.log(splat.csrftoken);
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    var auth = user.save(null, {
        type: 'put',
	success: function (model, resp) {
        // console.log("in success");
	    assert.deepEqual( resp, {}, "Signout returns empty response object" );
    	    done1();

	}
    });

    auth.done(function() { 
	movie.save(null, {
	    error: function (model, error) {
            // console.log("in error");
	        assert.equal( error.status, 403,
		    "Saving without authentication returns 403 status");
	        done2();
	    }
       });
    });
  });

 test("Test movie-delete triggers an error event if unauthenticated.", function(assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    var movie = new splat.Movie();  // model
    var movies = new splat.Movies();  // collection
    movies.add(movie);
    movie.set({"_id": "557761f092e40db92c3ccdae"});
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    var auth = user.save(null, {
        type: 'put',
	success: function (model, resp) {
           console.log("in success");
	    assert.deepEqual( resp, {}, "Signout returns empty response object" );
    	    done1();

	}
    });
    auth.done(function() { 
        // try to destroy an existing movie
        movie.destroy({
	    error: function (model, resp) {
               // console.log("in error");
               // console.log(model);
               // console.log(resp);
	        assert.equal( resp.status, 403,
		    "Deleting without authentication returns 403 status code" );
	        done2();
	    }
        });
    });
  });

 test("Test movie-save succeeds if session is authenticated.", function(assert) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var movie = new splat.Movie();  // model
    movie.set("_id", "565fa288c2b796e809b0a5e3");
    movie.urlRoot = '/movies';
    // fetch existing movie model
    var movieFetch = movie.fetch({
        success: function(movie, resp) {
            assert.equal( resp._id, "565fa288c2b796e809b0a5e3",
        "Successful movie fetch" );
        done1();
        }
    });
    // authenticate user with valid credentials
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
        "Successful login with valid credentials" );
            done2();
        }
    });
    $.when(movieFetch, auth).done(function() {
        // attempt to update existing movie
        movie.save({"title": "QUnit!"}, {
            success: function (model, resp) {
                assert.equal( resp.title, "QUnit!",
            "Saving model update succeeds when logged in" );
        done3();
            }
        });
    });
  });


  
 //----------------------------------Our test cases-------------------------------------------------------------------

QUnit.module('Our own tests', {
   setup: function() {
    // var movie = new splat.Movie();
    // var movies = new splat.Movies();  // collection
    // movie.urlRoot = '/movies';
    // movies.urlRoot = '/movies';
    // movie.set({"_id": "565fb20c20f8adf33a6c779c"});
    // // movies.add(movie);

    // var user = new splat.User({username:"a", password:"a", login: 1});
    // var auth = user.save(null, {
        
    //     type: 'put',
    //     success: function (model, resp) {
    //     //     assert.equal( resp.username, "a",
    //     // "Successful login with valid credentials" );
    //     //     done1();
    //     console.log("login complete in setup");
    //     },
    //     error: function(model,error){

    //         console.log("login failed in setup");
    //         console.log(error);
    //     }
    // });
    // auth.done(function(){


    //     console.log("IN SETUP");
    //     movies.create(movie);
    //     // movie.save(null, {
    //     //     error: function (model, error) {
    //     //             console.log("failed add movie in setup");
    //     //             console.log(error);
    //     //             // assert.equal( error.status, 403,
    //     //             // "Saving a movie without login returns 403 status");
    //     //             // done2();
    //     //     },
    //     //     success: function (model, resp) {
    //     //         console.log('added movie in detup');
                
    //     //     }
    //     // });

    // });

    // $.when(movie, auth).done(function() {
    //             var user = new splat.User({username:"a", password:"a"});
    //             var auth = user.save(null, {
    //                 type: 'put',
    //             success: function (model, resp) {
    //                 // console.log("in success");
    //                 // assert.deepEqual( resp, {}, "Signout returns empty response object" );
    //                 //     done1();
    //                 console.log("setup complete")

    //                 }
    //             });
        
    //         });
    // console.log("Leaving SETUP");
   },
   teardown: function() {
    // var movie = new splat.Movie();
    // var movies = new splat.Movies();  // collection
    // movie.urlRoot = '/movies';
    // movie.set({"_id": "565fb20c20f8adf33a6c779c"});
    // movies.add(movie);

    // var user = new splat.User({username:"a", password:"a", login: 1});
    // var auth = user.save(null, {
        
    //     type: 'put',
    //     success: function (model, resp) {
    //     //     assert.equal( resp.username, "a",
    //     // "Successful login with valid credentials" );
    //     //     done1();
       
    //     }
    // });
    // auth.done(function() {
    //     // attempt to delete existing movie
    //     console.log('in destructo');
    //     movie.destroy({
    //         success: function (model, resp) {
    //         //     assert.equal( resp._id, "",
    //         // "Successfully deleted" );
    //         // done2();
    //         }
    //     });
    // });

    // $.when(movie, auth).done(function() {
    //             var user = new splat.User();
    //             var auth = user.save(null, {
    //                 type: 'put',
    //             success: function (model, resp) {
    //                 // console.log("in success");
    //                 // assert.deepEqual( resp, {}, "Signout returns empty response object" );
    //                 //     done1();

    //                 }
    //             });
        
    //         });



   }

});

 test("Test log in with a not existing account.", function(assert) {
    assert.expect( 1 );
    var done1 = assert.async();

    var user = new splat.User({username:"b", password:"b", login: 1});
    var auth = user.save(null, {
        type: 'put',
        error: function(model, resp) {
            assert.notEqual( resp.username, 'c', "Unsuccessful login, account does not exist" );
            done1();
        }
    })
 });

  test("Test adding movie without being logged in", function(assert) {
    assert.expect( 2 );
    var done1 = assert.async();    
    var done2 = assert.async();    
    var user = new splat.User();
    var auth = user.save(null, {
        type: 'put',
    success: function (model, resp) {
        // console.log("in success");
        assert.deepEqual( resp, {}, "Signout returns empty response object" );
            done1();

    }
    });

    var movie = new splat.Movie(
        {"__v":0,    
        "dated":"2015-12-03T02:01:18.725Z",
        "director":"steve",
        "duration":222,
        "freshTotal":0,
        "freshVotes":0,
        "poster":"img/placeholder.png",
        "rating":"G",
        "released":"2001",
        "synopsis":"lol",
        "title":"AddWithoutLogIn",
        "trailer":"",
        "genre":["com"],
        "starring":["steve"]});
    var movies = new splat.Movies();  // collection
    movies.add(movie);
    auth.done(function() { 
        movie.save(null, {
            error: function (model, error) {
                console.log("in saving movie without login");
                assert.equal( error.status, 403,
                "Saving a movie without login returns 403 status");
                done2();
        },
        success: function (model, resp) {
            console.log('somehow succeeds saving without login');
            
        }
       });
    });

 });





 test("Test adding an already existing movie.", function(assert) {
    assert.expect( 2 );
    var done1 = assert.async();
    var done2 = assert.async();
    var movie = new splat.Movie({"__v":0,"_id":"565fa288c2b796e809b0a5e3",
    "dated":"2015-12-03T02:01:18.725Z","director":"steve","duration":122,
    "freshTotal":0,"freshVotes":0,"poster":"img/placeholder.png","rating":"G",
    "released":"2001","synopsis":"lol","title":"QUnit!","trailer":"","userid":
    "565e3627377da02036bf1ce4","genre":["com"],"starring":["steve"]});  // model
    var movies = new splat.Movies();  // collection
    movies.add(movie);
    console.log('added movie');
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            console.log('signed in');
            assert.equal( resp.username, "a",
        "Successful login with valid credentials" );
            done1();
        }
    });
    console.log("logged in");
    auth.done(function() { 
        movie.save(null, {
            error: function (model, error) {
                console.log("in saving same movie");
                assert.equal( error.status, 403,
                "Saving a movie that already exists returns 403 status");
                done2();
        },
        success: function (model, resp) {
            console.log('somehow succeeds adding duplicate movie');
            
        }
       });
    });
 });
 

 test("Test movie-delete twice triggers an error event while session is authenticated.", function(assert) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    // var done4 = assert.async();
    var movie = new splat.Movie();
    var movies = new splat.Movies();  // collection
    movie.urlRoot = '/movies';
    movie.set({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
    "director":"Sean Punn","duration":109,"freshTotal":18,"freshVotes":27,
    "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
    "rating":"R","released":"1999","synopsis":"great thriller",
    "title":"Zbrba Gomez","trailer":"http://archive.org",
    "userid":"54635fe6a1342684065f6959", "genre":["action"],
    "starring":["Bruce Willis,Amy Winemouse"]});
    movies.add(movie);

    // authenticate user with valid credentials
    console.log('in authenticationn');
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
        "Successful login with valid credentials" );
            done1();
        }
    });

    var saveMovie = $.Deferred();
    var deleteMovie1 = $.Deferred();
    // var deleteMovie2 = $.Deferred();

    auth.done(function() {

        movie.save(null, {
            error: function (model, error) {
                console.log("error in creating movie to delete");
                console.log(model);
                console.log(error);
                // assert.equal( error.status, 403,
                // "Saving a movie that already exists returns 403 status");
                // done2();
        },
        success: function (model, resp) {
            console.log('created movie to be delete');
            saveMovie.resolve();
            
        }
        });

    });
    
    $.when(auth,saveMovie).then(function(){
         // attempt to delete existing movie
        console.log('in destructo');
        movie.destroy({
            wait:true,
            success: function (model, resp) {
                console.log(resp);
                assert.equal( resp.responseText, "movie deleted",
            "Successfully deleted" );
            done2();
            deleteMovie1.resolve();
            },
            error:function(model,error){
                console.log("failed to delte movie on first try");
                console.log(error);
            }
        });

    $.when(auth,saveMovie,deleteMovie1).then(function(){ 
        // attempt to delete non-existing movie
        console.log('in destructo');
        movie.destroy({
            wait:true,
            success: function (model, resp) {
                console.log("delete should not succeed twice");
                console.log(model);
                console.log(resp);
                // assert.equal( resp._id, "",
            // "Successfully deleted twice some how" );
            
            },
            error: function (model, error) {
                assert.equal( error.status, 404,
            "Could not delete movie twice" );
            done3();
            },
        });

    });

    });



    
  });

 
  // Test if adding movie without signed in
  // ALREADY COVERD


  // Test sign up with an existing username
   test("Test signing up with existing user", function(assert) {
    assert.expect( 1 );
    var done1 = assert.async();
    var user = new splat.User({username:"a", password:"a", email:"a@a.com", login: 1});
    var auth = user.save(null, {
        type: 'post',
        success: function (model, resp) {
            console.log('signed UP despite existing account');
            // assert.equal( resp.username, "a",
            // "Successful login with valid credentials" );
            // done1();
        },
        error:function(model,error){
            assert.equal( error.status , 500,
            "Successfully denied signup on existing user" );
            done1();
            //   
        }
    });

   });

  // Test sign out and add movie; reject request
  //Already covered

  // Test add review without signing in
  // test("Test add review without signing in", function(assert) {
  //   assert.expect( 1 );
  //   var done1 = assert.async();
  //   var review = new splat.Review({
  //       reviewname:"Max",
  //       reviewaffil:"UTSc",
  //       reviewtext:"nope",
  //       freshness:1,
  //       movieid: '565fa288c2b796e809b0a5e3'

  //   });




  //  });


  // Test add review not with account
