// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat = splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Header = Backbone.View.extend({

    events: { 
        "mouseover a[id='ordering']" : "showMenu", 
        "mouseover div[id='orderDiv']" : "showMenu",
        "mouseleave a[id='ordering']" : "hideMenu",
        "mouseleave div[id='orderDiv']" : "hideMenu",

        "mouseover a[id='signUpLink']" : "showMenu", 
        "mouseover div[id='signUpDiv']" : "showMenu",
        "mouseleave a[id='signUpLink']" : "hideMenu",
        "mouseleave div[id='signUpDiv']" : "hideMenu",

        "mouseover a[id='signInLink']" : "showMenu", 
        "mouseover div[id='signInDiv']" : "showMenu",
        "mouseleave a[id='signInLink']" : "hideMenu",
        "mouseleave div[id='signInDiv']" : "hideMenu",




        "change input[type='radio']" : "sortOrder" 
    },

    showMenu: function(event) {
        // event.stopPropagation();
        // console.log(event);
        // var select ='#'+ event.target.name + 'Div';
        // console.log(event);
        // $(select).delay(1000).show();
        $('.dropdown-menu').show();
    },

    hideMenu: function(event) {
        // event.stopPropagation();
        // console.log(event);
        // var select ='#'+ event.target.name + 'Div';
        // console.log(event);
        // $(select).delay(1000).hide();
        $('.dropdown-menu').hide();
    },

    sortOrder: function(event) {
        console.log("change in sort order");
        // console.log(event);
        
        event.stopPropagation();
        splat.order = event.target.value;  // set app-level order field
        Backbone.trigger('orderevent', event);  // trigger event for other views
        $('form[id="orderForm"]').removeClass('open');  // close the dropdown menu
    },

    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());
	return this;    // support method chaining
    },

    //gives selected look for button or bar
    selectMenuItem: function(menuItem){
    	$('.active').removeClass('active');
    	$(menuItem).addClass('active');
    }

});
