import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphQL/getPosts";

const DeleteButton = ({ postId, commentId, callback }) => {
	const [confirmDelete, setConfirmDelete] = useState(false);

	const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

	const [deleteMutation] = useMutation(mutation, {
		update(proxy, result) {
			setConfirmDelete(false);

			if (!commentId) {
				try {
					const data = proxy.readQuery({
						query: FETCH_POSTS_QUERY
					});

					const newData = [...data.getPosts].filter(p => p.id !== postId);

					proxy.writeQuery({
						query: FETCH_POSTS_QUERY,
						data: { getPosts: newData }
					});
				} catch (err) {
					console.log(err);
				}
			}
			if (callback) callback();
		},
		variables: {
			postId,
			commentId
		}
	});

	return (
		<>
			<Button
				as="div"
				color="red"
				floated="right"
				onClick={() => setConfirmDelete(true)}>
				<Icon style={{ margin: 0 }} name="trash" />
			</Button>
			<Confirm
				open={confirmDelete}
				onCancel={() => setConfirmDelete(false)}
				onConfirm={deleteMutation}
			/>
		</>
	);
};

const DELETE_POST = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
