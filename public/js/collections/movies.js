splat.Movies = Backbone.Collection.extend({
    // identify collection’s model
    model: splat.Movie,

    // save movie models in localStorage under "splat" namespace
    // console.log
    localStorage: new Backbone.LocalStorage('splat')
});
splat.Movies = new splat.Movies();