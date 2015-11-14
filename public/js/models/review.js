splat.Review = Backbone.Model.extend({
    // match localStorage (later server DB) use of _id, rather than id
    idAttribute: "_id",
    // url: "http://mathlab.utsc.utoronto.ca:41302/movies",

    defaults: {
    	freshness: 0.0,
    	reviewText: "",
    	reviewName: "",
    	reviewAffil: "",
    	movieId: ""
    },

});
