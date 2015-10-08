splat.Movie = Backbone.Model.extend({
    // match localStorage (later server DB) use of _id, rather than id
    idAttribute: "_id",

    defaults: {
	title: "default",
	trailer: "mpv/default.mp4",
	poster: "img/default.png"
	// other model attributes
    }
});
