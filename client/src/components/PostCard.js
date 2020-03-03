import React, { useState } from "react";
import { Card, Image, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

const PostCard = props => {
	const [like, setLike] = useState(false);
	const [comment, setComment] = useState("");
	// Destructuring props and post objects to get data points of our post
	const {
		body,
		createdAt,
		id,
		username,
		likeCount,
		commentCount,
		likes
	} = props.post;

	const handleLikeClick = () => {
		setLike(!like);
	};

	const handleCommentOnPost = () => {
		setComment(console.log("Comment on Post"));
	};

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/molly.png"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button
					toggle
					active={like}
					onClick={handleLikeClick}
					color="teal"
					basic>
					<Icon name="heart" />
					{likeCount}
				</Button>
				<Button
					toggle
					active={comment}
					onClick={handleCommentOnPost}
					color="blue"
					basic>
					<Icon name={commentCount >= 3 ? "comments" : "comment"} />
					{commentCount}
				</Button>
			</Card.Content>
		</Card>
	);
};

export default PostCard;
