// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
		//add event to check if user leaves without saving
		"click #moviesave ": "save",
		"click #moviedel ": "delete",
		"change #imgsave": "selectImage",
		// "click #imagesave": "replace",
		'focusout input[type="text"]':"update",
		'dragover #img_pic': 'dragoverHandler',
		"drop #img_pic":"dropHandler"
	},

	//updates the model in the collection, if there isn't one, create it
	save:function(event){
		// console.log('trying to save');
		// console.log(splat.collection);

		var my_collection = splat.collection;
		
		//this is evaluated to the items in the for loop
		//so rename to self for now.
		var self = this;

		//get all the inputs with text type
		$('input[type="text"]').each(function(item){
			
			var name = $(this).attr('name');
			var val = $(this).val();
			
			var input = {};
			//javascript will interpet keys litteraly,so 
			//get around it by below notation
			input[name] = val;

			// set takes in dictionary,thus why we created input
			self.newMovie.set(input);
			// console.log(title,val);
			// var newMovie = new splat.Movie({})
		});
		console.log(this.newMovie);
		// console.log(my_collection);
		//splat.collection.add(newMovie);

		console.log(this.newMovie.attributes);
		if(this.isNew){
			//thus we create
			console.log(this);
			console.log(this.newMovie);
			console.log(self.newMovie);
			console.log('creating!');
			my_collection.create(this.newMovie, { 
            wait : true, 
            success : function (model,response) {
                // console.log('success',model);
                splat.utils.showNotice('success','operation complete');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
            	splat.utils.showNotice('danger','could not save');
				console.log('fail',model);
            }
     
		});
		}else{
			console.log(this);
			console.log(this.newMovie.attributes);
			console.log(self.newMovie);
			console.log('saving!');
			console.log(this.newMovie);
			this.newMovie.save(null,{ 
            wait : true, 
            success : function (model,response) {
                console.log('success',model);
                //consider navigating to movie page
                splat.utils.showNotice('success','operation complete');
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
				console.log('fail',model);
				splat.utils.showNotice('danger','could not save');
            }
        	});
		}
		// this.newMovie = null;
		// this.isNew = null;
			
	},

	//delete model in collection, prompt user to double check,
	//return to browse view when done
	delete:function(event){
		//check if model is associated with this view
		if(!this.newMovie){
			//if it doesn't exist already
			//return
			splat.app.navigate('#', {replace:true, trigger:true});
		}else{
			var my_collection = splat.collection;
			this.newMovie.destroy({
				wait:true,
				success : function (model,response) {
                console.log('deleted',model);
                splat.utils.showNotice('success','operation complete');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
				console.log('failed to delete',model);
				splat.utils.showNotice('danger','could not delete');
            }

			});
		}

	},

	//updates local model
	update:function(event){
		var item = $(event.currentTarget);
		
		// console.log(item);
		// console.log(item.attr('id'));
		splat.utils.hideValidationNotice(item);
		// console.log(item.attr('name'));

		splat.utils.showNotice('info','Remember to click Save Changes Button');
		if (this.newMovie.validateCheck(item)) {
			//console.log('IS VALID');
			var name = item.attr('name');
			var val = item.val();
			var input = {};
			input[name] = val;
			this.newMovie.set(input);
			console.log(this.newMovie);
		}
		else {
			//console.log('IS NOTs VALID');
			var name = item.attr('name');
			var msg;
			if (name == 'title') {
				msg = "Only 1 or more letters-digits-spaces allowed"
			}
			else if (name == 'released') {
				msg = "Released must be between 1910 and 2016"
			}
			else if (name == 'director') {
				msg = "You must enter a director's name"
			}
			else if (name == 'rating') {
				msg = "You must enter either G, PG, PG-13, R, or NC-17"
			}
			else if (name == 'starring') {
				msg = "You must enter starring with one or more comma seperated sequences of whitespace-seperated words"
			}
			else if (name == 'duration') {
				msg = "Duration must be between 0-999"
			}
			else if (name == 'genre') {
				msg = "You must enter genre with one or more comma seperated sequences of whitespace-seperated words"
			}
			else if (name == 'synopsis') {
				msg = "Must contain some text"
			}
			else if (name == 'trailer') {
				msg = "Must be in proper URL format (e.g. http://www.example.com)"
			}
			splat.utils.showValidationNotice(item,msg);
			//error handling for part 3
		}
		// console.log(item);

	},


    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());

	this.notify={ 
            wait : true, 
            success : function (model,response) {
                // console.log('success',model);
                splat.utils.showNotice('success','operation complete');
                //consider navigating to movie page
                splat.app.navigate('#', {replace:true, trigger:true});
            },
            fail: function(model, response){
            	splat.utils.showNotice('danger','operation complete');
				console.log('fail',model);
            }
    };
	//initalize model
	if (!this.newMovie){
		this.newMovie = new splat.Movie();
		this.isNew = true;
	}

	return this;    // support method chaining
    },

    // Read pictureFile from filesystem, resulting in
	// DataURL (base64 representation of image data). 
	// Use as model poster attrib. and image src attrib.
	imageRead: function(pictureFile, type) {
		var self = this;
		var reader = new FileReader();
		// callback for when read operation is finished
		// console.log('in imageRead');
		// console.log(pictureFile,type);
		reader.onload = function(event) {
			//insert image on load here

			// // image.src = sourceImg; 

			var targetImgElt = $('.dropzone')[0];
			// // reader.result is image data in base64 format
			// // targetImgElt.src = reader.result;

			
			targetImgElt.src = self.resize(event.target.result);
			console.log(targetImgElt.src);
			// // console.log(targetImgElt);
			// // self.newMovie.set('poster', reader.result);
			self.newMovie.set('poster', targetImgElt.src);
			// // console.log(self.newMovie);
			// console.log(reader.result);
			$('#displayimg').attr('src',targetImgElt.src);
			
		};
		reader.readAsDataURL(pictureFile); // read image file
	},
    // image upload done in save-handler, to avoid 
	// multiple-upload cost if user reselects image
    selectImage: function(event) {
		// set object attribute for image uploader
		// console.log('in selectImage');
		// console.log(event);
		this.pictureFile = event.target.files[0];
		// if the file type is image, read it
		// console.log('selectImage',this.pictureFile.type);
		if ( this.pictureFile.type.match(/image\/((jpeg)|(png)|(gif)|(jpg))/) ) {
			this.imageRead(this.pictureFile, 
			this.pictureFile.type);
		}else{
			splat.utils.showNotice('danger',"This picture type is not supported");
		}
		// else display error notification
	},

    dropHandler: function(event){
    	event.stopPropagation();
    	event.preventDefault();
    	var ev = event.originalEvent;
    	this.pictureFile = ev.dataTransfer.files[0];
    	console.log(event.originalEvent);
    	console.log(this.pictureFile);
    	if ( this.pictureFile.type.match(/image\/((jpeg)|(png)|(gif)|(jpg))/) ) {
			// Read image file and display in img tag
			this.imageRead(this.pictureFile, 
			this.pictureFile.type);
		}else{
			splat.utils.showNotice('danger',"This picture type is not supported");
		}
			// else display notification error
    },

    dragoverHandler: function(event) {

    	event.stopPropagation();
    	event.preventDefault();
    	console.log('dragging!',event);
    	event.originalEvent.dataTransfer.dropEffect = 'copy';
    },
    // Resize sourceImg, returning result as a DataURL value. Type, 
	// quality are optional params for image-type and quality setting
	resize: function(sourceImg, type, quality) {
		console.log('in resize!');
		var self = this;
		var type = type || "image/jpeg"; // default MIME image type
		var quality = quality || "0.95"; // tradeoff quality vs size
		var image = new Image(), MAX_HEIGHT = 300, MAX_WIDTH = 450;
		image.src = sourceImg;
		console.log(image.height);
		console.log(image.width);
		// image.height = image.height // ADD CODE to scale height
		// image.width = image.width // ADD CODE to scale width
		if(image.height > MAX_HEIGHT) {
			image.width = MAX_WIDTH;
			image.height = MAX_HEIGHT;
		}
		console.log(image.height);
		console.log(image.width);
		var canvas = document.createElement("canvas"); 
		canvas.width = image.width; // scale canvas to match image
		canvas.height = image.height;
		var ctx = canvas.getContext("2d"); // get 2D rendering context
		ctx.drawImage(image,0,0, image.width, image.height); // render
		return canvas.toDataURL(type, quality);
	}

});