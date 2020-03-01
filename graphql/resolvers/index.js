const postResolvers = require("./posts");
const userResolvers = require("./users");
const commentsrResolvers = require("./comments");

module.exports = {
	Query: {
		...postResolvers.Query
	},
	Mutation: {
		...userResolvers.Mutation,
		...postResolvers.Mutation,
		...commentsrResolvers.Mutation
	}
};
