splat.Movies = Backbone.Collection.extend({
    // identify collection’s model
    model: splat.Movie,
    url: 'http://mathlab.utsc.utoronto.ca:41302/movies',

    // save movie models in localStorage under "splat" namespace
    // console.log
    localStorage: new Backbone.LocalStorage('splat')
});
