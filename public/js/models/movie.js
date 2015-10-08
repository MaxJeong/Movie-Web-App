splat.Movie = Backbone.Model.extend({
    // match localStorage (later server DB) use of _id, rather than id
    idAttribute: "_id",

    defaults: {
	title: "default",
	release: null,
	director: "",
	starring: [],
	rating: "",
	duration: null,
	genre: [],
	synopsis: "",
	freshTotal: 0.0,
	freshVotes: 0.0,
	trailer: "mpv/default.mp4",
	poster: "img/default.png",
	date: new Date()
	// other model attributes
    }
});
