import React, { useState, useEffect } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const LikeButton = ({ user, post: { id, likeCount, likes } }) => {
	const [like, setLike] = useState(false);

	const [likePost] = useMutation(LIKE_POST, {
		variables: { postId: id }
	});

	useEffect(() => {
		if (user && likes.find(like => like.username === user.username)) {
			setLike(true);
		} else {
			setLike(false);
		}
	}, [user, likes]);

	return (
		<>
			<Popup
				content="Like the post"
				trigger={
					<Button
						toggle
						active={like}
						onClick={likePost}
						color="teal"
						basic={user && like ? false : true}
						as={!user ? Link : undefined}
						to={!user ? "/login" : undefined}>
						<Icon name="heart" />
						{likeCount}
					</Button>
				}
			/>
		</>
	);
};

const LIKE_POST = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
