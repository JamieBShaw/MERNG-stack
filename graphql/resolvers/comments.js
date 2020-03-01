const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");
const { UserInputError, AuthenticationError } = require("apollo-server");
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
				post.comment.unshift({
					body,
					username,
					createdAt: createdAt()
				});
				await post.save();
				return post;
			} else throw new UserInputError("Post not found");
		},
		deleteComment: async (_, { postId, commentId }, context) => {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				const commentIndex = post.comments.findIndex(c => c.id === commentId);

				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} else {
				throw new UserInputError("Post not found");
			}
		}
	}
};
