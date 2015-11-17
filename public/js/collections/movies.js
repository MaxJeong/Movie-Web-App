splat.Movies = Backbone.Collection.extend({
    // identify collection’s model
    model: splat.Movie,
    url: '/movies'
    
    // save movie models in localStorage under "splat" namespace
    // console.log
    // localStorage: new Backbone.LocalStorage('splat')
});
