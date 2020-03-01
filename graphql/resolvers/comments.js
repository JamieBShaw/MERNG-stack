const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");
const { UserInputError } = require("apollo-server");
const createdAt = require("../../util/createdAt");

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			const { username } = checkAuth(context);
			if (body.trim() === "") {
				throw new UserInputError("Empty Comment", {
					errors: {
						body: "Comment body must not be empty"
					}
				});
			}

			const post = await Post.findById(postId);

			if (post) {
				post.comments.unshift({
					body,
					username,
					createdAt: createdAt()
				});
				await post.save();
				return post;
			} else throw new UserInputError("Post not found");
		}
	}
};
