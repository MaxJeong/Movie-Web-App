splat.Reviews = Backbone.Collection.extend({
    // identify collection’s model
    model: splat.Review,
    url: '/movies/:id/reviews'
    
    // save movie models in localStorage under "splat" namespace
    // console.log
    // localStorage: new Backbone.LocalStorage('reviews')
});
